<?php

namespace App\Security\Voter;

use App\Entity\Event;
use App\Entity\User;
use App\Enum\Feature;
use App\Enum\Visibility;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

// Heavily commented Voter to not get lost with the scope permissions.
// This Voter obviously only applies for the API and not the admin, thus admin roles are not relevant.
final class EventVoter extends Voter
{
    public const VIEW = 'EVENT_VIEW';
    public const ADD = 'EVENT_ADD';
    public const EDIT = 'EVENT_EDIT';
    public const DELETE = 'EVENT_DELETE';
    public const ADD_PARTICIPANTS = 'EVENT_ADD_PARTICIPANTS';
    public const ADD_ROLES = 'EVENT_ADD_ROLES';
    public const SET_VISIBILITY = 'EVENT_SET_VISIBILITY';

    // Can the user view an event?
    public function canView(User $user, Event $event): bool
    {
        // The scope currently used by the user
        $scope = $user->getCurrentScope();

        // If no access to the agenda, or the event isn't active, then no access to the event
        if (!$event->isActive() || !$scope->hasFeature(Feature::AGENDA_ACCESS)) {
            return false;
        }

        // If the user created the event, or has the same structure as the event, or is part of the participants
        if ($event->getCreatedBy() === $user
            || $event->getScope()->getStructure() === $scope->getStructure()
            || $event->getUsers()->contains($user)
            || $event->getScope()->getStructure()->getParentStructure() === $scope->getStructure()
            || $event->getScope()->getStructure()->getChildStructures()->contains($scope->getStructure())
        ) {
            // If the event is a child structure but the scope cannot see child events, then no access
            if ($event->getScope()->getStructure()->getParentStructure() === $scope->getStructure() && !$scope->hasFeature(Feature::SEE_CHILD_EVENTS)) {
                return false;
            }

            // If the visibility is public, then the user can view the event
            // If the visibility is restricted, then the user can view the event if he is part of the participants or is the creator
            // If the visibility is private, then the user can view the event if he is the creator
            return match ($event->getVisibility()) {
                Visibility::PUBLIC_ACCESS => true,
                Visibility::RESTRICTED_ACCESS => $event->getCreatedBy() === $user
                    || $event->getUsers()->contains($user)
                    || $event->getScope()->getStructure() === $scope->getStructure(),
                Visibility::PRIVATE_ACCESS => $event->getCreatedBy() === $user,
                default => false,
            };
        }

        // Always return false by default
        return false;
    }

    // Can the user add an event?
    public function canAdd(User $user, Event $event): bool
    {
        // The scope currently used by the user
        $scope = $user->getCurrentScope();

        // If no access to the agenda, then impossible to add an event
        if (!$scope->hasFeature(Feature::AGENDA_ACCESS)) {
            return false;
        }

        // Can add an event if access to the agenda and if permission to add events
        return $scope->hasFeature(Feature::EVENT_CRUD);
    }

    // Can the user edit an event?
    public function canEdit(User $user, Event $event): bool
    {
        // The scope currently used by the user
        $scope = $user->getCurrentScope();

        // If no access to the agenda, then impossible to edit an event
        if (!$scope->hasFeature(Feature::AGENDA_ACCESS)) {
            return false;
        }

        // If is creator of the event, then the user can edit the event if granted
        if ($event->getCreatedBy() === $user) {
            return $scope->hasFeature(Feature::EVENT_CRUD);
        }

        // If same structure, then the user can edit the event if granted
        if ($event->getScope()->getStructure() === $scope->getStructure()) {
            return $scope->hasFeature(Feature::EDIT_THIRD_PARTY_EVENT);
        }

        // If child structure, then the user can edit the event if granted
        if ($scope->getStructure()->getChildStructures()->contains($event->getScope()->getStructure())) {
            return $scope->hasFeature(Feature::EDIT_CHILD_EVENT);
        }

        // Return false by default
        return false;
    }

    // Can the user delete an event?
    public function canDelete(User $user, Event $event): bool
    {
        // The scope currently used by the user
        $scope = $user->getCurrentScope();

        // If no access to the agenda, then impossible to delete an event
        if (!$scope->hasFeature(Feature::AGENDA_ACCESS)) {
            return false;
        }

        // If is creator of the event, then the user can delete the event if granted
        if ($event->getCreatedBy() === $user) {
            return $scope->hasFeature(Feature::EVENT_CRUD);
        }

        // If same structure, then the user can delete the event if granted
        if ($event->getScope()->getStructure() === $scope->getStructure()) {
            return $scope->hasFeature(Feature::DELETE_THIRD_PARTY_EVENT);
        }

        // If child structure, then the user can delete the event if granted
        if ($scope->getStructure()->getChildStructures()->contains($event->getScope()->getStructure())) {
            return $scope->hasFeature(Feature::DELETE_CHILD_EVENT);
        }

        // Return false by default
        return false;
    }

    // Can the user add participants to an event?
    public function canAddParticipants(User $user, Event $event): bool
    {
        // The scope currently used by the user
        $scope = $user->getCurrentScope();

        // If no access to the agenda, then impossible to add participants to an event
        if (!$scope->hasFeature(Feature::AGENDA_ACCESS)) {
            return false;
        }

        return $scope->hasFeature(Feature::NOMINATIVE_INVITATIONS);
    }

    // Can the user add roles to an event?
    public function canAddRoles(User $user, Event $event): bool
    {
        // The scope currently used by the user
        $scope = $user->getCurrentScope();

        // If no access to the agenda, then impossible to add roles to an event
        if (!$scope->hasFeature(Feature::AGENDA_ACCESS)) {
            return false;
        }

        return $scope->hasFeature(Feature::CUSTOMIZE_GUEST_FUNCTIONS);
    }

    // Can the user change the visibility of an event?
    public function canSetVisibility(User $user, Event $event): bool
    {
        // The scope currently used by the user
        $scope = $user->getCurrentScope();

        // If creating an event, then the user can change the visibility
        if (null === $event->getId()) {
            return true;
        }

        // If no access to the agenda, then impossible to change the visibility of an event
        if (!$scope->hasFeature(Feature::AGENDA_ACCESS)) {
            return false;
        }

        return $scope->hasFeature(Feature::CUSTOMIZE_EVENT_VISIBILITY) || $event->getCreatedBy() === $user;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return \in_array($attribute, [
            self::VIEW,
            self::ADD,
            self::EDIT,
            self::DELETE,
            self::ADD_PARTICIPANTS,
            self::ADD_ROLES,
            self::SET_VISIBILITY,
        ], true) && $subject instanceof Event;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface || !$user instanceof User) {
            return false;
        }

        if (null === $user->getCurrentScope() || !$user->isValidScope($user->getCurrentScope())) {
            return false;
        }

        return match ($attribute) {
            self::VIEW => $this->canView($user, $subject),
            self::ADD => $this->canAdd($user, $subject),
            self::EDIT => $this->canEdit($user, $subject),
            self::DELETE => $this->canDelete($user, $subject),
            self::ADD_PARTICIPANTS => $this->canAddParticipants($user, $subject),
            self::ADD_ROLES => $this->canAddRoles($user, $subject),
            self::SET_VISIBILITY => $this->canSetVisibility($user, $subject),
            default => false,
        };
    }
}
