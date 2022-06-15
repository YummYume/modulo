<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\Event;
use App\Entity\User;
use App\Repository\EventRepository;
use App\Security\Voter\EventVoter;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Security;

class UserAllowedEventsProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(private Security $security, private EventRepository $eventRepository)
    {
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return 'get-allowed' === $operationName && Event::class === $resourceClass;
    }

    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): iterable
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException();
        }

        return array_filter(
            $this->eventRepository->findAllExceptInactive(),
            fn (Event $event): bool => $this->security->isGranted(EventVoter::VIEW, $event)
        );
    }
}
