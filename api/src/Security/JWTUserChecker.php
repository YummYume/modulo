<?php

namespace App\Security;

use App\Entity\User as AppUser;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

final class JWTUserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if (!$user instanceof AppUser) {
            return;
        }

        if (0 >= $user->getActiveScopes()->count()) {
            throw new AccessDeniedException('Ce compte ne possède aucune scope. Impossible de procéder à l\'authentification.');
        }
    }

    public function checkPostAuth(UserInterface $user): void
    {
    }
}
