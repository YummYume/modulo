<?php

namespace App\EventListener;

use Symfony\Component\Security\Http\Event\LogoutEvent;

final class LogoutListener
{
    public function onLogout(LogoutEvent $logoutEvent): void
    {
        $response = $logoutEvent->getResponse();
        $response->headers->clearCookie('BEARER', secure: true, httpOnly: true, sameSite: 'lax');
    }
}
