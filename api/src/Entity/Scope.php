<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Enum\Feature;
use App\Repository\ScopeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ScopeRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ['event:get']])]
#[UniqueEntity(fields: ['structure', 'role'], message: 'scope.unique')]
class Scope
{
    use BlameableTrait;
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['get:me'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Structure::class, inversedBy: 'scopes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['get:me', 'event:get'])]
    private ?Structure $structure;

    #[ORM\ManyToOne(targetEntity: Role::class, inversedBy: 'scopes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['get:me', 'event:get'])]
    private ?Role $role;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['get:me'])]
    private bool $active = true;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'scopes')]
    private Collection $users;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->structure.' - '.$this->role;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStructure(): ?Structure
    {
        return $this->structure;
    }

    public function setStructure(?Structure $structure): self
    {
        $this->structure = $structure;

        return $this;
    }

    public function getRole(): ?Role
    {
        return $this->role;
    }

    public function setRole(?Role $role): self
    {
        $this->role = $role;

        return $this;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function hasFeature(Feature $feature): bool
    {
        return \in_array($feature->name, $this->getRole()->getFeatures(), true);
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->addScope($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->removeElement($user)) {
            $user->removeScope($this);
        }

        return $this;
    }
}
