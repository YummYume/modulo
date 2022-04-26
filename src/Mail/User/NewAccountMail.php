<?php

namespace App\Mail\User;

use App\Entity\User;
use App\Enum\RecipientType;
use App\Model\Mail\MailAbstract;

class NewAccountMail extends MailAbstract
{
    public const KEY = 'user/new-account';

    public function __construct(private User $user, private string $password)
    {
        $this->addUserRecipient($user, RecipientType::MAIN);
    }

    public function getTemplateParameters(): array
    {
        return [
            'firstName' => $this->user->getFirstName(),
            'uuid' => $this->user->getUuid(),
            'password' => $this->password,
        ];
    }

    public function getKey(): string
    {
        return self::KEY;
    }
}
