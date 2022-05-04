<?php

namespace App\Command\User;

use App\Domain\Command\User\CreateUserCommand as CreateUserDomainCommand;
use App\Service\Messenger\CommandDispatcher;
use App\Service\User\PasswordGenerator;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:user:create',
    description: 'Creates a new user.',
    hidden: false
)]
class CreateUserCommand extends Command
{
    public function __construct(private CommandDispatcher $messageDispatcher, private PasswordGenerator $passwordGenerator)
    {
        parent::__construct();
    }

    public function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $firstName = (string) $input->getArgument('firstName');
        $lastName = (string) $input->getArgument('lastName');
        $gender = (string) $input->getArgument('gender');
        $uuid = (string) $input->getArgument('uuid');
        $email = (string) $input->getArgument('email');
        $password = (string) $input->getArgument('password');
        $isAdmin = (bool) $input->getOption('admin');

        if (empty($password)) {
            $password = $this->passwordGenerator->generate(10);
        }

        $io->info(sprintf(
            'Creating user with uuid %s and email %s%s',
            $uuid,
            $email,
            $isAdmin ? ' (admin)' : ''
        ));

        try {
            $createUserDomainCommand = (new CreateUserDomainCommand())
                ->setUuid($uuid)
                ->setEmail($email)
                ->setFirstName($firstName)
                ->setLastName($lastName)
                ->setGender($gender)
                ->setPassword($password)
                ->setIsAdmin($isAdmin)
            ;
            $this->messageDispatcher->dispatch($createUserDomainCommand);
        } catch (\Throwable $exception) {
            $io->error(sprintf(
                'Failed creating user : %s at line %u in %s.',
                $exception->getMessage(),
                $exception->getLine(),
                $exception->getFile(),
            ));

            return Command::FAILURE;
        }

        $io->success(sprintf(
            'User %s created with password %s',
            $uuid,
            $password
        ));

        return Command::SUCCESS;
    }

    protected function configure(): void
    {
        $this
            ->addArgument('firstName', InputArgument::REQUIRED, 'The user\'s first name.')
            ->addArgument('lastName', InputArgument::REQUIRED, 'The user\'s last name.')
            ->addArgument('gender', InputArgument::REQUIRED, 'The user\'s gender.')
            ->addArgument('uuid', InputArgument::REQUIRED, 'The user\'s uuid (9 digits).')
            ->addArgument('email', InputArgument::REQUIRED, 'The user\'s email address.')
            ->addArgument('password', InputArgument::OPTIONAL, 'The user\'s password.')
            ->addOption('admin', 'a', InputOption::VALUE_NONE, 'Grants admin privileges to the user.')
        ;
    }
}
