<?php

namespace App\EventListener;

use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\Security\Http\Event\LogoutEvent;

final class LogoutListener
{
    public function __construct(private ContainerBagInterface $params)
    {
    }

    public function onLogout(LogoutEvent $logoutEvent): void
    {
        $response = $logoutEvent->getResponse();
        $domain = $this->params->get('host_domain');
        $response->headers->clearCookie('BEARER', secure: true, httpOnly: true, sameSite: 'lax', domain: ".${domain}");
    }
}
