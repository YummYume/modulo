<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;

final class JWTDecodedListener
{
    public function onJWTDecoded(JWTDecodedEvent $event): void
    {
        $payload = $event->getPayload();

        if (!isset($payload['current_scope']) || !is_numeric($payload['current_scope'])) {
            $event->markAsInvalid();
        }

        $event->setPayload($payload);
    }
}
