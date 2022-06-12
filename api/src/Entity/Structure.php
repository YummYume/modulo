<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\StructureRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: StructureRepository::class)]
#[ApiResource]
class Structure
{
    use BlameableTrait;
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(['get:me'])]
    private ?string $name;

    #[ORM\Column(type: 'string', length: 10)]
    private ?string $code;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'childStructures')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Structure $parentStructure = null;

    #[ORM\OneToMany(mappedBy: 'structure', targetEntity: Scope::class, orphanRemoval: true)]
    private Collection $scopes;

    #[ORM\OneToMany(mappedBy: 'parentStructure', targetEntity: self::class)]
    private Collection $childStructures;

    public function __construct()
    {
        $this->scopes = new ArrayCollection();
        $this->childStructures = new ArrayCollection();
    }

    public function __toString(): string
    {
        return $this->name ?? '';
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(?string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getParentStructure(): ?self
    {
        return $this->parentStructure;
    }

    public function setParentStructure(?self $parentStructure): self
    {
        $this->parentStructure = $parentStructure;

        return $this;
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
            $scope->setStructure($this);
        }

        return $this;
    }

    public function removeScope(Scope $scope): self
    {
        if ($this->scopes->removeElement($scope)) {
            // set the owning side to null (unless already changed)
            if ($scope->getStructure() === $this) {
                $scope->setStructure(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getChildStructures(): Collection
    {
        return $this->childStructures;
    }

    public function addChildStructure(self $childStructure): self
    {
        if (!$this->childStructures->contains($childStructure)) {
            $this->childStructures[] = $childStructure;
            $childStructure->setParentStructure($this);
        }

        return $this;
    }

    public function removeChildStructure(self $childStructure): self
    {
        if ($this->childStructures->removeElement($childStructure)) {
            // set the owning side to null (unless already changed)
            if ($childStructure->getParentStructure() === $this) {
                $childStructure->setParentStructure(null);
            }
        }

        return $this;
    }
}
