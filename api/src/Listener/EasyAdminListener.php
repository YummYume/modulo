<?php

namespace App\Listener;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Event\AfterEntityDeletedEvent;
use EasyCorp\Bundle\EasyAdminBundle\Event\AfterEntityPersistedEvent;
use EasyCorp\Bundle\EasyAdminBundle\Event\AfterEntityUpdatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Translation\TranslatableMessage;

final class EasyAdminListener implements EventSubscriberInterface
{
    public function __construct(private RequestStack $requestStack)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            AfterEntityPersistedEvent::class => ['flashMessageAfterPersist'],
            AfterEntityUpdatedEvent::class => ['flashMessageAfterUpdate'],
            AfterEntityDeletedEvent::class => ['flashMessageAfterDelete'],
        ];
    }

    public function flashMessageAfterPersist(AfterEntityPersistedEvent $event): void
    {
        /**
         * @var Session $session
         */
        $session = $this->requestStack->getSession();
        $request = $this->requestStack->getCurrentRequest();
        $entity = $event->getEntityInstance();

        if (!$request->isXmlHttpRequest()) {
            $session->getFlashBag()->add('success', new TranslatableMessage('flash.create.success', [
                'name' => (string) $entity,
            ]));

            if ($entity instanceof User && 0 >= $entity->getActiveScopes()->count()) {
                $session->getFlashBag()->add('warning', new TranslatableMessage('flash.user.warning.scopes', [
                    'name' => (string) $entity,
                ]));
            }
        }
    }

    public function flashMessageAfterUpdate(AfterEntityUpdatedEvent $event): void
    {
        /**
         * @var Session $session
         */
        $session = $this->requestStack->getSession();
        $request = $this->requestStack->getCurrentRequest();
        $entity = $event->getEntityInstance();

        if (!$request->isXmlHttpRequest()) {
            $session->getFlashBag()->add('success', new TranslatableMessage('flash.update.success', [
                'name' => (string) $entity,
            ]));

            if ($entity instanceof User && 0 >= $entity->getActiveScopes()->count()) {
                $session->getFlashBag()->add('warning', new TranslatableMessage('flash.user.warning.scopes', [
                    'name' => (string) $entity,
                ]));
            }
        }
    }

    public function flashMessageAfterDelete(AfterEntityDeletedEvent $event): void
    {
        /**
         * @var Session $session
         */
        $session = $this->requestStack->getSession();
        $request = $this->requestStack->getCurrentRequest();

        if (!$request->isXmlHttpRequest()) {
            $session->getFlashBag()->add('success', new TranslatableMessage('flash.delete.success', [
                'name' => (string) $event->getEntityInstance(),
            ]));
        }
    }
}
