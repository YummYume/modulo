<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Enum\Feature;
use App\Repository\RoleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JetBrains\PhpStorm\Pure;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RoleRepository::class)]
#[ApiResource]
class Role
{
    use BlameableTrait;
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(['get:me', 'event:get'])]
    private ?string $name;

    #[ORM\Column(type: 'string', length: 10)]
    private ?string $code;

    #[ORM\Column(type: 'string', length: 100, nullable: true)]
    private ?string $feminineName = null;

    #[ORM\ManyToOne(targetEntity: AgeSection::class)]
    private ?AgeSection $ageSection;

    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    private ?string $icon;

    #[ORM\OneToMany(mappedBy: 'role', targetEntity: Scope::class, orphanRemoval: true)]
    private Collection $scopes;

    #[ORM\ManyToMany(targetEntity: Category::class, inversedBy: 'roles')]
    private Collection $categories;

    #[ORM\ManyToMany(targetEntity: Category::class, mappedBy: 'invitedRoles')]
    private Collection $defaultCategories;

    #[ORM\Column(type: 'json')]
    #[Groups(['get:me'])]
    #[Assert\Choice(callback: 'getAllowedFeatures', multipleMessage: 'role.features.choice', multiple: true)]
    private array $features = [];

    #[ORM\ManyToMany(targetEntity: Event::class, mappedBy: 'roles')]
    private Collection $events;

    #[Pure]
    public function __construct()
    {
        $this->scopes = new ArrayCollection();
        $this->categories = new ArrayCollection();
        $this->defaultCategories = new ArrayCollection();
        $this->events = new ArrayCollection();
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

    public function getFeminineName(): ?string
    {
        return $this->feminineName;
    }

    public function setFeminineName(?string $feminineName): self
    {
        $this->feminineName = $feminineName;

        return $this;
    }

    public function getAgeSection(): ?AgeSection
    {
        return $this->ageSection;
    }

    public function setAgeSection(?AgeSection $ageSection): self
    {
        $this->ageSection = $ageSection;

        return $this;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }

    public function setIcon(?string $icon): self
    {
        $this->icon = $icon;

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
            $scope->setRole($this);
        }

        return $this;
    }

    public function removeScope(Scope $scope): self
    {
        if ($this->scopes->removeElement($scope)) {
            // set the owning side to null (unless already changed)
            if ($scope->getRole() === $this) {
                $scope->setRole(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Category>
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(Category $category): self
    {
        if (!$this->categories->contains($category)) {
            $this->categories[] = $category;
        }

        return $this;
    }

    public function removeCategory(Category $category): self
    {
        $this->categories->removeElement($category);

        return $this;
    }

    /**
     * @return Collection<int, Category>
     */
    public function getDefaultCategories(): Collection
    {
        return $this->defaultCategories;
    }

    public function addDefaultCategory(Category $defaultCategory): self
    {
        if (!$this->defaultCategories->contains($defaultCategory)) {
            $this->defaultCategories[] = $defaultCategory;
            $defaultCategory->addInvitedRole($this);
        }

        return $this;
    }

    public function removeDefaultCategory(Category $defaultCategory): self
    {
        if ($this->defaultCategories->removeElement($defaultCategory)) {
            $defaultCategory->removeInvitedRole($this);
        }

        return $this;
    }

    public function getFeatures(): array
    {
        return $this->features;
    }

    public function setFeatures(array $features): self
    {
        $this->features = $features;

        return $this;
    }

    public function getAllowedFeatures(): array
    {
        return Feature::toArray(true);
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
            $event->addRole($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->removeElement($event)) {
            $event->removeRole($this);
        }

        return $this;
    }
}
