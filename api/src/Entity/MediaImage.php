<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\CreateMediaImageAction;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\FileRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[ORM\Entity(repositoryClass: FileRepository::class)]
#[Vich\Uploadable]
#[ApiResource(
    iri: 'http://schema.org/MediaObject',
    normalizationContext: ['groups' => ['media:read']],
    itemOperations: ['get'],
    collectionOperations: [
        'get',
        'post' => [
            'controller' => CreateMediaImageAction::class,
            'deserialize' => false,
            'validation_groups' => ['Default', 'media_create'],
            'openapi_context' => [
                'requestBody' => [
                    'content' => [
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'image' => [
                                        'type' => 'string',
                                        'format' => 'binary',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ]
)]
class MediaImage
{
    use BlameableTrait;
    use TimestampableTrait;

    #[ApiProperty(iri: 'http://schema.org/contentUrl')]
    #[Groups(['media:read', 'get', 'get:me'])]
    public ?string $contentUrl = null;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[Vich\UploadableField(
        mapping: 'media_image',
        fileNameProperty: 'imageName',
        size: 'imageSize',
        mimeType: 'imageMimeType',
        originalName: 'imageOriginalName',
        dimensions: 'imageDimensions'
    )]
    #[Assert\Image(
        maxSize: '2M',
        detectCorrupted: false,
        corruptedMessage: 'media_image.corrupted',
        maxSizeMessage: 'media_image.max_size',
        disallowEmptyMessage: 'media_image.empty',
        mimeTypesMessage: 'media_image.mime_types',
        notReadableMessage: 'media_image.not_readable',
        uploadCantWriteErrorMessage: 'media_image.upload_cant_write_error',
        uploadErrorMessage: 'media_image.upload_error',
        uploadExtensionErrorMessage: 'media_image.upload_extension_error',
        uploadFormSizeErrorMessage: 'media_image.upload_form_size_error',
        uploadIniSizeErrorMessage: 'media_image.upload_ini_size_error',
        uploadNoFileErrorMessage: 'media_image.upload_no_file_error',
        uploadNoTmpDirErrorMessage: 'media_image.upload_no_tmp_dir_error',
        uploadPartialErrorMessage: 'media_image.upload_partial_error',
    )]
    private ?File $image = null;

    #[ORM\Column(type: 'string', nullable: true)]
    private ?string $imageName = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $imageSize = null;

    #[ORM\Column(type: 'string', nullable: true)]
    private ?string $imageMimeType = null;

    #[ORM\Column(type: 'string', nullable: true)]
    private ?string $imageOriginalName = null;

    #[ORM\Column(type: 'array', nullable: true)]
    private ?array $imageDimensions = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private \DateTimeInterface $uploadTimestamp;

    #[ORM\OneToOne(mappedBy: 'avatar', targetEntity: User::class)]
    private ?User $user;

    public function __toString(): string
    {
        return $this->imageName ?? '';
    }

    public function __serialize(): array
    {
        return [
            'id' => $this->id,
            'imageName' => $this->imageName,
            'imageSize' => $this->imageSize,
            'imageMimeType' => $this->imageMimeType,
            'imageOriginalName' => $this->imageOriginalName,
            'imageDimensions' => $this->imageDimensions,
        ];
    }

    public function __unserialize(array $data): void
    {
        $this->id = $data['id'];
        $this->imageName = $data['imageName'];
        $this->imageSize = $data['imageSize'];
        $this->imageMimeType = $data['imageMimeType'];
        $this->imageOriginalName = $data['imageOriginalName'];
        $this->imageDimensions = $data['imageDimensions'];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setImage(?File $image = null): self
    {
        $this->image = $image;

        if (null !== $image) {
            $this->uploadTimestamp = new \DateTimeImmutable();
        }

        return $this;
    }

    public function getImage(): ?File
    {
        return $this->image;
    }

    public function setImageName(?string $imageName): self
    {
        $this->imageName = $imageName;

        return $this;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    public function setImageSize(?int $imageSize): self
    {
        $this->imageSize = $imageSize;

        return $this;
    }

    public function getImageSize(): ?int
    {
        return $this->imageSize;
    }

    public function setImageMimeType(?string $imageMimeType): self
    {
        $this->imageMimeType = $imageMimeType;

        return $this;
    }

    public function getImageMimeType(): ?string
    {
        return $this->imageMimeType;
    }

    public function setImageOriginalName(?string $imageOriginalName): self
    {
        $this->imageOriginalName = $imageOriginalName;

        return $this;
    }

    public function getImageOriginalName(): ?string
    {
        return $this->imageOriginalName;
    }

    public function setImageDimensions(?array $imageDimensions): self
    {
        $this->imageDimensions = $imageDimensions;

        return $this;
    }

    public function getImageDimensions(): ?array
    {
        return $this->imageDimensions;
    }

    public function setUploadTimestamp(\DateTimeInterface|\DateTimeImmutable|null $uploadTimestamp): self
    {
        $this->uploadTimestamp = $uploadTimestamp;

        return $this;
    }

    public function getUploadTimestamp(): ?\DateTimeInterface
    {
        return $this->uploadTimestamp;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        // unset the owning side of the relation if necessary
        if (null === $user && null !== $this->user) {
            $this->user->setAvatar(null);
        }

        // set the owning side of the relation if necessary
        if (null !== $user && $user->getAvatar() !== $this) {
            $user->setAvatar($this);
        }

        $this->user = $user;

        return $this;
    }
}
