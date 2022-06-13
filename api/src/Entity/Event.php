<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\ScopeableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: EventRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['get', 'event:get']],
    collectionOperations: [
        'get',
        'post' => [
            'security_post_denormalize' => "is_granted('EVENT_ADD', object)",
            'security_post_denormalize_message' => 'You are not allowed to add an event.',
        ],
    ],
    itemOperations: [
        'get',
        'patch',
        'put',
        'delete',
    ]
)]
class Event
{
    use BlameableTrait;
    use ScopeableTrait;
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['event:get'])]
    #[Assert\NotBlank(message: 'event.name.blank', allowNull: false)]
    private ?string $name;

    #[ORM\Column(type: 'text')]
    #[Groups(['event:get'])]
    #[Assert\NotBlank(message: 'event.description.blank', allowNull: false)]
    private ?string $description;

    #[ORM\ManyToMany(targetEntity: Category::class, inversedBy: 'events')]
    #[Groups(['event:get'])]
    private Collection $categories;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'events')]
    #[Groups(['event:get'])]
    private Collection $users;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['event:get'])]
    private bool $active = true;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['event:get'])]
    #[Assert\Type(type: 'datetime', message: 'event.start_date.type')]
    private ?\DateTime $startDate;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['event:get'])]
    #[Assert\Type(type: 'datetime', message: 'event.end_date.type')]
    #[Assert\GreaterThanOrEqual(propertyPath: 'startDate', message: 'event.end_date.invalid')]
    private ?\DateTime $endDate;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['event:get'])]
    private bool $visible;

    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'events')]
    #[Groups(['event:get'])]
    private Collection $roles;

    public function __construct()
    {
        $this->categories = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->roles = new ArrayCollection();
    }

    public function __toString()
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
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        $this->users->removeElement($user);

        return $this;
    }

    public function getActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(?\DateTimeInterface $startDate): self
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(?\DateTimeInterface $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getVisible(): ?bool
    {
        return $this->visible;
    }

    public function setVisible(bool $visible): self
    {
        $this->visible = $visible;

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
        }

        return $this;
    }

    public function removeRole(Role $role): self
    {
        $this->roles->removeElement($role);

        return $this;
    }
}
