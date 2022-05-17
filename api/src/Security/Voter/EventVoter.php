<?php

namespace App\Security\Voter;

use App\Entity\Event;
use App\Entity\Scope;
use App\Entity\User;
use App\Enum\Feature;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class EventVoter extends Voter
{
    public const ADD = 'EVENT_ADD';

    public function canAdd(User $user, ?int $currentScope): bool
    {
        $scope = $user->getCurrentScope($currentScope);

        if (null === $scope || !$scope instanceof Scope) {
            return false;
        }

        return \in_array(static fn (string $feature): bool => Feature::EVENT_CRUD->name === $feature, $scope->getRole()->getFeatures(), true);
    }

    protected function supports(string $attribute, $subject): bool
    {
        return \in_array($attribute, [self::ADD], true)
            && $subject instanceof Event;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        switch ($attribute) {
            case self::ADD:
                return $this->canAdd($user, $subject);
                break;
        }

        return false;
    }
}
