<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTAuthenticatedEvent;

final class JWTAuthenticatedListener
{
    public function onJWTAuthenticated(JWTAuthenticatedEvent $event): void
    {
        $token = $event->getToken();
        $payload = $event->getPayload();
        $scopeId = isset($payload['current_scope']) ? $payload['current_scope'] : null;

        $token->setAttribute('current_scope', $scopeId);
    }
}
