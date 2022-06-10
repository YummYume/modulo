<?php

namespace App\Security\Voter;

use App\Entity\Event;
use App\Entity\User;
use App\Enum\Feature;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class EventVoter extends Voter
{
    public const VIEW = 'EVENT_VIEW';
    public const ADD = 'EVENT_ADD';
    public const EDIT = 'EVENT_EDIT';
    public const DELETE = 'EVENT_DELETE';

    public function canView(User $user, Event $event): bool
    {
        $scope = $user->getCurrentScope();

        if (null === $scope || !$user->isValidScope($scope)) {
            return false;
        }

        if ($scope !== $event->getScope()) {
            return false;
        }

        return $scope->hasFeature(Feature::AGENDA_ACCESS);
    }

    public function canAdd(User $user, Event $event): bool
    {
        $scope = $user->getCurrentScope();

        if (null === $scope || !$user->isValidScope($scope)) {
            return false;
        }

        return $scope->hasFeature(Feature::EVENT_CRUD);
    }

    public function canEdit(User $user, Event $event): bool
    {
        $scope = $user->getCurrentScope();

        if (null === $scope || !$user->isValidScope($scope)) {
            return false;
        }

        return $scope->hasFeature(Feature::EVENT_CRUD);
    }

    public function canDelete(User $user, Event $event): bool
    {
        $scope = $user->getCurrentScope();

        if (null === $scope || !$user->isValidScope($scope)) {
            return false;
        }

        return $scope->hasFeature(Feature::EVENT_CRUD);
    }

    protected function supports(string $attribute, $subject): bool
    {
        return \in_array($attribute, [self::VIEW, self::ADD, self::EDIT, self::DELETE], true) && $subject instanceof Event;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface || !$user instanceof User) {
            return false;
        }

        switch ($attribute) {
            case self::VIEW:
                return $this->canView($user, $subject);
                break;
            case self::ADD:
                return $this->canAdd($user, $subject);
                break;
            case self::EDIT:
                return $this->canEdit($user, $subject);
                break;
            case self::DELETE:
                return $this->canDelete($user, $subject);
                break;
            default:
                throw new \LogicException('This code should not be reached.');
        }

        return false;
    }
}
