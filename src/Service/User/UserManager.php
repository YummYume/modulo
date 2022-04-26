<?php

namespace App\Service\User;

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserManager
{
    public function __construct(private UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function encryptPassword(User $user): void
    {
        if (!$user->getPlainPassword()) {
            return;
        }

        $user
            ->setPassword($this->passwordHasher->hashPassword(
                $user,
                $user->getPlainPassword(),
            ))
            ->eraseCredentials()
        ;
    }
}
