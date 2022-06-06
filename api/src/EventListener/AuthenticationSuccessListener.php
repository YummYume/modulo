<?php

namespace App\EventListener;

use App\Entity\User;
use App\Serializer\UserNormalizer;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\Security\Core\User\UserInterface;

final class AuthenticationSuccessListener
{
    public function __construct(private UserNormalizer $userNormalizer)
    {
    }

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event): void
    {
        $user = $event->getUser();

        if (!$user instanceof UserInterface || !$user instanceof User) {
            return;
        }

        $data = $this->userNormalizer->normalize($user, 'jsonld', ['groups' => ['get:me']]);

        $event->setData($data);
    }
}
