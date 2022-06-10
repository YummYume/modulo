<?php

namespace App\Security;

use App\Entity\Scope;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Authenticator\JWTAuthenticator;
use Symfony\Component\Security\Core\User\UserInterface;

final class JWTExtendedAuthenticator extends JWTAuthenticator
{
    protected function loadUser(array $payload, string $identity): UserInterface|User
    {
        /**
         * @var User
         */
        $user = parent::loadUser($payload, $identity);
        $scopeId = isset($payload['current_scope']) ? $payload['current_scope'] : null;

        if (null !== $scopeId && is_numeric($scopeId)) {
            $scope = $user->getActiveScopes()->filter(static fn (Scope $scope): bool => (int) $scopeId === $scope->getId());

            if (!$scope->isEmpty()) {
                $user->setCurrentScope($scope->first());
            }
        }

        return $user;
    }
}
