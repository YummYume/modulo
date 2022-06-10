<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

final class UserSwitchScopeSubscriber implements EventSubscriberInterface
{
    public function __construct(private Security $security, private JWTTokenManagerInterface $JWTManager, private AuthenticationSuccessHandler $authenticationSuccessHandler)
    {
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::RESPONSE => ['switchScope', EventPriorities::POST_RESPOND],
        ];
    }

    public function switchScope(ResponseEvent $event): void
    {
        $request = $event->getRequest();
        $method = $request->getMethod();
        $route = $request->get('_route');
        $user = $this->security->getUser();

        if (!$user instanceof User || Request::METHOD_GET !== $method || 'api_users_switch-scope_item' !== $route) {
            return;
        }

        // Contains the CORS headers
        $response = $event->getResponse();
        $scope = $request->get('scope');

        if (null === $scope) {
            $event->setResponse(new JsonResponse(['error' => 'Missing "scope" parameter.', 'code' => 400], 400, $response->headers->all()));

            return;
        } elseif (!is_numeric($scope)) {
            $event->setResponse(new JsonResponse(
                ['error' => 'The "scope" parameter must be a numeric corresponding to the id of the desired scope.', 'code' => 400],
                400,
                $response->headers->all()
            ));

            return;
        }

        $authResponse = $this->authenticationSuccessHandler->handleAuthenticationSuccess($user);
        $cookies = $authResponse->headers->getCookies();

        foreach ($cookies as $cookie) {
            $response->headers->setCookie($cookie);
        }

        $response->setContent($authResponse->getContent());

        $event->setResponse($response);
    }
}
