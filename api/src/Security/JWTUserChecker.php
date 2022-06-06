<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

final class JWTUserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if (!$user instanceof User) {
            return;
        }

        if ($user->getActiveScopes()->isEmpty()) {
            throw new CustomUserMessageAuthenticationException('Authentication cannot proceed.', code: 403);
        }
    }

    public function checkPostAuth(UserInterface $user): void
    {
    }
}
