<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\CreateMediaFileAction;
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
            'controller' => CreateMediaFileAction::class,
            'deserialize' => false,
            'validation_groups' => ['Default', 'media_create'],
            'openapi_context' => [
                'requestBody' => [
                    'content' => [
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
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
class MediaFile
{
    use BlameableTrait;
    use TimestampableTrait;

    #[ApiProperty(iri: 'http://schema.org/contentUrl')]
    #[Groups(['media:read', 'get'])]
    public ?string $contentUrl = null;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[Vich\UploadableField(
        mapping: 'media_file',
        fileNameProperty: 'fileName',
        size: 'fileSize',
        mimeType: 'fileMimeType',
        originalName: 'fileOriginalName',
        dimensions: 'fileDimensions'
    )]
    #[Assert\File(
        maxSize: '5M',
        maxSizeMessage: 'media_file.max_size',
        disallowEmptyMessage: 'media_file.empty',
        mimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/csv',
            'text/csv',
            'application/json',
            'text/plain',
            'application/msword',
        ],
        mimeTypesMessage: 'media_file.mime_types',
        notReadableMessage: 'media_file.not_readable',
        uploadCantWriteErrorMessage: 'media_file.upload_cant_write_error',
        uploadErrorMessage: 'media_file.upload_error',
        uploadExtensionErrorMessage: 'media_file.upload_extension_error',
        uploadFormSizeErrorMessage: 'media_file.upload_form_size_error',
        uploadIniSizeErrorMessage: 'media_file.upload_ini_size_error',
        uploadNoFileErrorMessage: 'media_file.upload_no_file_error',
        uploadNoTmpDirErrorMessage: 'media_file.upload_no_tmp_dir_error',
        uploadPartialErrorMessage: 'media_file.upload_partial_error',
    )]
    private ?File $file = null;

    #[ORM\Column(type: 'string')]
    private ?string $fileName = null;

    #[ORM\Column(type: 'integer')]
    private ?int $fileSize = null;

    #[ORM\Column(type: 'string')]
    private ?string $fileMimeType = null;

    #[ORM\Column(type: 'string')]
    private ?string $fileOriginalName = null;

    #[ORM\Column(type: 'array')]
    private ?array $fileDimensions = null;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $uploadTimestamp;

    public function __toString(): string
    {
        return $this->fileName ?? '';
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setFile(?File $file = null): self
    {
        $this->file = $file;

        if (null !== $file) {
            $this->uploadTimestamp = new \DateTimeImmutable();
        }

        return $this;
    }

    public function getFile(): ?File
    {
        return $this->file;
    }

    public function setFileName(?string $fileName): self
    {
        $this->fileName = $fileName;

        return $this;
    }

    public function getFileName(): ?string
    {
        return $this->fileName;
    }

    public function setFileSize(?int $fileSize): self
    {
        $this->fileSize = $fileSize;

        return $this;
    }

    public function getFileSize(): ?int
    {
        return $this->fileSize;
    }

    public function setFileMimeType(?string $fileMimeType): self
    {
        $this->fileMimeType = $fileMimeType;

        return $this;
    }

    public function getFileMimeType(): ?string
    {
        return $this->fileMimeType;
    }

    public function setFileOriginalName(?string $fileOriginalName): self
    {
        $this->fileOriginalName = $fileOriginalName;

        return $this;
    }

    public function getFileOriginalName(): ?string
    {
        return $this->fileOriginalName;
    }

    public function setFileDimensions(?array $fileDimensions): self
    {
        $this->fileDimensions = $fileDimensions;

        return $this;
    }

    public function getFileDimensions(): ?array
    {
        return $this->fileDimensions;
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
}
