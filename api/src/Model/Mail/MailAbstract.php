<?php

namespace App\Model\Mail;

use App\Entity\User;
use App\Enum\RecipientType;

abstract class MailAbstract
{
    /** @var array<Recipient> */
    private array $recipients = [];

    abstract public function getKey(): string;

    public function getSender(): ?string
    {
        return null;
    }

    public function getTemplateParameters(): array
    {
        return [];
    }

    public function getTemplate(): string
    {
        return sprintf('mail/%s.html.twig', $this->getKey());
    }

    public function getRecipients(): array
    {
        return $this->recipients;
    }

    public function addRecipient(string $name, string $email, RecipientType $type)
    {
        $this->recipients[] = new Recipient($name, $email, $type);
    }

    public function addUserRecipient(User $user, RecipientType $type)
    {
        $this->addRecipient($user->getFullName(), $user->getEmail(), $type);
    }
}
