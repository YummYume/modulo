<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Enum\Feature;
use App\Repository\ScopeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ScopeRepository::class)]
#[ApiResource]
#[UniqueEntity(fields: ['user', 'structure', 'role'], message: 'scope.unique')]
class Scope
{
    use BlameableTrait;
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['get:me'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'scopes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user;

    #[ORM\ManyToOne(targetEntity: Structure::class, inversedBy: 'scopes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['get:me'])]
    private ?Structure $structure;

    #[ORM\ManyToOne(targetEntity: Role::class, inversedBy: 'scopes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['get:me'])]
    private ?Role $role;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['get:me'])]
    private bool $active = true;

    public function __toString()
    {
        return $this->structure.' - '.$this->role;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
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
}
