<?php

namespace App\Model\Mail;

use App\Enum\RecipientType;
use Symfony\Component\Mime\Address;

class Recipient
{
    private string $name;
    private string $email;
    private RecipientType $type;

    public function __construct(string $name, string $email, RecipientType $type)
    {
        $this->name = $name;
        $this->email = $email;
        $this->type = $type;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getType(): RecipientType
    {
        return $this->type;
    }

    public function toMimeAddress(): Address
    {
        return new Address($this->email, $this->name);
    }
}
