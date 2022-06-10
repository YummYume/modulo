<?php

namespace App\EventListener;

use App\Entity\User;
use App\Repository\ScopeRepository;
use App\Repository\UserRepository;
use App\Service\User\UserManager;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

final class JWTCreatedListener
{
    public function __construct(
        private RequestStack $requestStack,
        private UserRepository $userRepository,
        private ScopeRepository $scopeRepository,
        private UserManager $userManager
    ) {
    }

    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        /**
         * @var User
         */
        $user = $event->getUser();
        $request = $this->requestStack->getCurrentRequest();
        $requestScope = $request->get('scope');
        $payload = $event->getData();

        $this->userManager->setCurrentScopeFromId($user, $requestScope);

        $payload['current_scope'] = $user->getCurrentScope() ? $user->getCurrentScope()->getId() : null;
        $event->setData($payload);
    }
}
