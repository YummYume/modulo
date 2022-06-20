<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\ScopeableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Enum\Visibility;
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
        'get-allowed' => [
            'method' => 'GET',
            'path' => '/events/allowed',
            'openapi_context' => [
                'summary' => 'Get only the events which the current user can see.',
                'description' => 'Get only the events which the current user can see.',
                'responses' => [
                    '200' => [
                        'description' => 'The events allowed for the current user.',
                        'content' => [
                            'application/ld+json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Event',
                                ],
                            ],
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Event',
                                ],
                            ],
                            'text/html' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Event',
                                ],
                            ],
                        ],
                    ],
                    '401' => [
                        'description' => 'The JWT is missing or invalid.',
                        'content' => [
                            'application/ld+json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/MissingJWT',
                                ],
                            ],
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/MissingJWT',
                                ],
                            ],
                            'text/html' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/MissingJWT',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    itemOperations: [
        'get' => [
            'security_post_denormalize' => "is_granted('EVENT_VIEW', object)",
            'security_post_denormalize_message' => 'You are not allowed to view this event.',
        ],
        'patch' => [
            'security_post_denormalize' => "is_granted('EVENT_EDIT', object)",
            'security_post_denormalize_message' => 'You are not allowed to edit this event.',
        ],
        'put' => [
            'security_post_denormalize' => "is_granted('EVENT_EDIT', object)",
            'security_post_denormalize_message' => 'You are not allowed to edit this event.',
        ],
        'delete' => [
            'security_post_denormalize' => "is_granted('EVENT_DELETE', object)",
            'security_post_denormalize_message' => 'You are not allowed to delete this event.',
        ],
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

    #[ORM\Column(type: 'string', nullable: false, enumType: Visibility::class)]
    #[Groups(['event:get'])]
    #[Assert\NotBlank(message: 'event.visibility.blank', allowNull: false)]
    private Visibility $visibility;

    #[ORM\Column(type: 'datetime', nullable: false)]
    #[Groups(['event:get'])]
    #[Assert\Type(type: 'datetime', message: 'event.start_date.type')]
    private ?\DateTime $startDate;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['event:get'])]
    #[Assert\Type(type: 'datetime', message: 'event.end_date.type')]
    #[Assert\GreaterThanOrEqual(propertyPath: 'startDate', message: 'event.end_date.invalid')]
    private ?\DateTime $endDate;

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

    public function isActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    public function getVisibility(): ?Visibility
    {
        return $this->visibility;
    }

    public function setVisibility(Visibility $visibility): self
    {
        $this->visibility = $visibility;

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
