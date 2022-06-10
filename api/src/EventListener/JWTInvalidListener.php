<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationFailureResponse;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

final class JWTInvalidListener
{
    public function __construct(private ContainerBagInterface $params)
    {
    }

    public function onJWTInvalid(JWTInvalidEvent $event): void
    {
        if ('authentication_token' === $event->getRequest()->get('_route')) {
            $response = new JWTAuthenticationFailureResponse(
                'An invalid JWT was present during the authentication request. It has been removed. Please retry.',
                409
            );

            $domain = $this->params->get('host_domain');
            $response->headers->clearCookie('BEARER', secure: true, httpOnly: true, sameSite: 'lax', domain: ".${domain}");
            $response->headers->clearCookie('refresh_token', secure: true, httpOnly: true, sameSite: 'lax', domain: ".${domain}");

            $event->setResponse($response);
        }
    }
}
