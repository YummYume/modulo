<?php

namespace App\EventListener;

use App\Entity\User;
use App\Service\User\UserManager;
use Doctrine\Persistence\Event\LifecycleEventArgs;

final class UserListener
{
    public function __construct(private UserManager $userManager)
    {
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof User) {
            return;
        }

        $this->userManager->encryptPassword($entity);
    }

    public function preUpdate(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof User) {
            return;
        }

        $this->userManager->encryptPassword($entity);
    }
}
