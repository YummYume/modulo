<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\ScopeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

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
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'scopes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user;

    #[ORM\ManyToOne(targetEntity: Structure::class, inversedBy: 'scopes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Structure $structure;

    #[ORM\ManyToOne(targetEntity: Role::class, inversedBy: 'scopes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Role $role;

    #[ORM\Column(type: 'boolean')]
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
}
