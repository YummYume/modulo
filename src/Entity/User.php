<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Enum\Gender;
use App\Enum\StaticRole;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[UniqueEntity(fields: ['uuid'], message: 'There is already an account with this uuid')]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ApiResource(
    normalizationContext: ['groups' => ['get']]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    use BlameableTrait;
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 96, unique: true)]
    #[Groups(['get'])]
    private ?string $uuid;

    #[ORM\Column(type: 'string', length: 200, unique: true)]
    #[Groups(['get'])]
    private ?string $email;

    #[ORM\Column(type: 'json')]
    #[Groups(['get'])]
    private array $roles = [];

    private ?string $plainPassword = null;

    #[ORM\Column(type: 'string')]
    private ?string $password;

    #[ORM\Column(type: 'string')]
    #[Groups(['get'])]
    private ?string $firstName;

    #[ORM\Column(type: 'string')]
    #[Groups(['get'])]
    private ?string $lastName;

    #[ORM\Column(type: 'string', nullable: false, enumType: Gender::class)]
    #[Groups(['get'])]
    private ?Gender $gender;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Scope::class, orphanRemoval: true)]
    #[Groups(['get'])]
    private Collection $scopes;

    public function __construct()
    {
        $this->scopes = new ArrayCollection();
    }

    public function __toString(): string
    {
        return $this->getFullName();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(?string $uuid): self
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->uuid;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = StaticRole::ROLE_USER->name;

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getGender(): ?Gender
    {
        return $this->gender;
    }

    public function setGender(?Gender $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    #[Groups(['get'])]
    public function getFullName(): string
    {
        return trim(sprintf('%s %s', $this->getFirstName(), $this->getLastName()));
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    public function getApiFields(): array
    {
        return [
            'uuid' => $this->uuid,
            'email' => $this->email,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'fullName' => $this->getFullName(),
            'gender' => $this->gender?->value,
            'roles' => $this->getRoles(),
            'scopes' => $this->scopes->toArray(),
        ];
    }

    /**
     * @return Collection<int, Scope>
     */
    public function getScopes(): Collection
    {
        return $this->scopes;
    }

    public function addScope(Scope $scope): self
    {
        if (!$this->scopes->contains($scope)) {
            $this->scopes[] = $scope;
            $scope->setUser($this);
        }

        return $this;
    }

    public function removeScope(Scope $scope): self
    {
        if ($this->scopes->removeElement($scope)) {
            // set the owning side to null (unless already changed)
            if ($scope->getUser() === $this) {
                $scope->setUser(null);
            }
        }

        return $this;
    }
}
