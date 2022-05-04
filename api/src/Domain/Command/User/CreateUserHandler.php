<?php

namespace App\Domain\Command\User;

use App\Entity\User;
use App\Enum\Gender;
use App\Enum\StaticRole;
use App\Exception\Mailer\MailException;
use App\Mail\User\NewAccountMail;
use App\Repository\UserRepository;
use App\Service\Mailer\Mailer;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class CreateUserHandler implements MessageHandlerInterface
{
    public function __construct(
        private UserPasswordHasherInterface $userPasswordHasher,
        private Mailer $mailer,
        private UserRepository $userRepository
    ) {
    }

    /**
     * @throws MailException
     */
    public function __invoke(CreateUserCommand $command): void
    {
        $user = (new User())
            ->setUuid($command->getUuid())
            ->setEmail($command->getEmail())
            ->setFirstName($command->getFirstName())
            ->setLastName($command->getLastName())
            ->setGender(Gender::tryFrom($command->getGender()) ?? Gender::OTHER)
            ->setPlainPassword($command->getPassword())
            ->setRoles($command->isAdmin() ? [StaticRole::ROLE_USER->name, StaticRole::ROLE_ADMIN->name] : [StaticRole::ROLE_USER->name])
        ;

        $this->userRepository->add($user);

        $this->mailer->sendMail(new NewAccountMail($user, $command->getPassword()));
    }
}
