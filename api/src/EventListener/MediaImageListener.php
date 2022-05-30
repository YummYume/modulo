<?php

namespace App\EventListener;

use App\Entity\MediaImage;
use App\Repository\MediaImageRepository;
use Doctrine\Persistence\Event\LifecycleEventArgs;

final class MediaImageListener
{
    public function __construct(private MediaImageRepository $mediaImageRepository)
    {
    }

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof MediaImage) {
            return;
        }

        if (null === $entity->getImageName()) {
            $this->mediaImageRepository->remove($entity);
        }
    }
}
