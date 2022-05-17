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
use Symfony\Component\Validator\Constraints as Assert;

#[UniqueEntity(fields: ['uuid'], message: 'user.uuid.unique')]
#[UniqueEntity(fields: ['email'], message: 'user.email.unique')]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ApiResource(
    normalizationContext: ['groups' => ['get', 'get:me']],
    itemOperations: [
        'get',
        'put',
        'delete',
        'me' => [
            'method' => 'GET',
            'path' => '/me',
            'defaults' => ['id' => 0],
            'openapi_context' => [
                'summary' => 'Get the current user.',
                'description' => 'Get the current user.',
                'responses' => [
                    '200' => [
                        'description' => 'The current user\'s API fields.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/User',
                                ],
                            ],
                        ],
                    ],
                    '401' => [
                        'description' => 'The JWT is missing or invalid.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/MissingJWT',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ]
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
    #[Groups(['get', 'get:me'])]
    #[Assert\Regex(pattern: '/^[0-9]{9}$/', message: 'user.uuid.invalid')]
    private ?string $uuid;

    #[ORM\Column(type: 'string', length: 200, unique: true)]
    #[Groups(['get', 'get:me'])]
    #[Assert\NotBlank(allowNull: false, message: 'user.email.not_blank')]
    #[Assert\Email(message: 'user.email.invalid')]
    private ?string $email;

    #[ORM\Column(type: 'json')]
    #[Groups(['get', 'get:me'])]
    #[Assert\Choice(callback: 'getAllowedRoles', multipleMessage: 'user.role.choice', multiple: true)]
    private array $roles = [];

    #[Assert\Length(min: 8, max: 50, minMessage: 'user.password.min_length', maxMessage: 'user.password.max_length')]
    #[Assert\Regex(pattern: '/^[^\s](?=.*[a-z])(?=.*[A-Z])(?=.*\d).+[^\s]$/', message: 'user.password.invalid')]
    #[Assert\NotCompromisedPassword(message: 'user.password.compromised')]
    private ?string $plainPassword = null;

    #[ORM\Column(type: 'string')]
    private ?string $password;

    #[ORM\Column(type: 'string')]
    #[Groups(['get', 'get:me'])]
    private ?string $firstName;

    #[ORM\Column(type: 'string')]
    #[Groups(['get', 'get:me'])]
    private ?string $lastName;

    #[ORM\Column(type: 'string', nullable: false, enumType: Gender::class)]
    #[Groups(['get', 'get:me'])]
    private ?Gender $gender;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Scope::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    #[Groups(['get', 'get:me'])]
    #[Assert\Valid()]
    #[Assert\Unique(message: 'user.scopes.unique', normalizer: 'trim')]
    private Collection $scopes;

    #[ORM\ManyToMany(targetEntity: Event::class, mappedBy: 'participants')]
    private Collection $events;

    public function __construct()
    {
        $this->scopes = new ArrayCollection();
        $this->events = new ArrayCollection();
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
            'scopes' => array_map(static function (Scope $scope): array {
                return [
                    'id' => $scope->getId(),
                    'active' => $scope->isActive(),
                    'role' => [
                        'name' => $scope->getRole()->getName(),
                    ],
                    'structure' => [
                        'name' => $scope->getStructure()->getName(),
                    ],
                ];
            }, $this->getActiveScopes()->toArray()),
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

    /**
     * @return Collection<int, Scope>
     */
    public function getActiveScopes(): Collection
    {
        return $this->scopes->filter(static fn (Scope $scope): bool => $scope->isActive());
    }

    /**
     * @return Collection<int, Scope>
     */
    public function getInavtiveScopes(): Collection
    {
        return $this->scopes->filter(static fn (Scope $scope): bool => !$scope->isActive());
    }

    public function getCurrentScope(?int $currentScope): Collection
    {
        return $this->getActiveScopes()->filter(static fn (Scope $scope): bool => $currentScope === $scope->getId())->first();
    }

    public function getAllowedRoles(): array
    {
        return StaticRole::toArray(true);
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): self
    {
        if (!$this->events->contains($event)) {
            $this->events[] = $event;
            $event->addParticipant($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->removeElement($event)) {
            $event->removeParticipant($this);
        }

        return $this;
    }
}
