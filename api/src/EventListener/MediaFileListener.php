<?php

namespace App\EventListener;

use App\Entity\MediaFile;
use App\Repository\MediaFileRepository;
use Doctrine\Persistence\Event\LifecycleEventArgs;

final class MediaFileListener
{
    public function __construct(private MediaFileRepository $mediaFileRepository)
    {
    }

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof MediaFile) {
            return;
        }

        if (null === $entity->getFileName()) {
            $this->mediaFileRepository->remove($entity);
        }
    }
}
