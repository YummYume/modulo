<?php

namespace App\Service\User;

use App\Entity\Scope;
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

    public function setCurrentScopeFromId(User $user, string|int|null $id): void
    {
        $currentScope = $user->getDefaultScope();

        if (null !== $id && is_numeric($id)) {
            $scope = $user->getActiveScopes()->filter(static fn (Scope $scope): bool => (int) $id === $scope->getId());

            if (!$scope->isEmpty()) {
                $currentScope = $scope->first();
            }
        }

        $user->setCurrentScope($currentScope);
    }
}
