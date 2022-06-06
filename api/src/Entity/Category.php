<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ApiResource]
class Category
{
    use BlameableTrait;
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['event:get'])]
    private ?string $name;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['event:get'])]
    private ?string $description;

    #[ORM\ManyToMany(targetEntity: Role::class, mappedBy: 'categories')]
    private Collection $roles;

    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'defaultCategories')]
    #[Assert\All([
        new Assert\Expression(expression: 'value in this.getRoles().toArray()', message: 'category.invited_roles.expression'),
    ])]
    private Collection $invitedRoles;

    #[ORM\ManyToMany(targetEntity: Event::class, mappedBy: 'categories')]
    private Collection $events;

    public function __construct()
    {
        $this->roles = new ArrayCollection();
        $this->invitedRoles = new ArrayCollection();
        $this->events = new ArrayCollection();
    }

    public function __toString(): string
    {
        return $this->name;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, Role>
     */
    public function getRoles(): Collection
    {
        return $this->roles;
    }

    public function addRole(Role $role): self
    {
        if (!$this->roles->contains($role)) {
            $this->roles[] = $role;
            $role->addCategory($this);
        }

        return $this;
    }

    public function removeRole(Role $role): self
    {
        if ($this->roles->removeElement($role)) {
            $role->removeCategory($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Role>
     */
    public function getInvitedRoles(): Collection
    {
        return $this->invitedRoles;
    }

    public function addInvitedRole(Role $invitedRole): self
    {
        if (!$this->invitedRoles->contains($invitedRole)) {
            $this->invitedRoles[] = $invitedRole;
        }

        return $this;
    }

    public function removeInvitedRole(Role $invitedRole): self
    {
        $this->invitedRoles->removeElement($invitedRole);

        return $this;
    }

    public function getAllowedRoles(): array
    {
        return $this->roles->toArray();
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
            $event->addCategory($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->removeElement($event)) {
            $event->removeCategory($this);
        }

        return $this;
    }
}
