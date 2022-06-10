<?php

namespace App\EventListener;

use App\Entity\User;
use App\Serializer\UserNormalizer;
use App\Service\User\UserManager;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;

final class AuthenticationSuccessListener
{
    public function __construct(private UserNormalizer $userNormalizer, private UserManager $userManager, private RequestStack $requestStack)
    {
    }

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event): void
    {
        $user = $event->getUser();
        $request = $this->requestStack->getCurrentRequest();

        if (!$user instanceof UserInterface || !$user instanceof User) {
            return;
        }

        $this->userManager->setCurrentScopeFromId($user, $request->get('scope'));

        $data = $this->userNormalizer->normalize($user, 'jsonld', ['groups' => ['get:me']]);

        $event->setData($data);
    }
}
