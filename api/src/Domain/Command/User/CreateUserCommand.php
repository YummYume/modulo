<?php

namespace App\Domain\Command\User;

use App\Enum\Gender;
use Symfony\Component\Validator\Constraints as Assert;

class CreateUserCommand
{
    #[Assert\Regex(pattern: '/^[0-9]{9}$/', message: 'create_user_command.uuid.invalid')]
    private ?string $uuid = null;

    #[Assert\Email(message: 'create_user_command.email.invalid')]
    private ?string $email = null;

    #[Assert\NotBlank(message: 'create_user_command.first_name.not_blank')]
    private ?string $firstName = null;

    #[Assert\NotBlank(message: 'create_user_command.last_name.not_blank')]
    private ?string $lastName = null;

    #[Assert\NotBlank(message: 'create_user_command.gender.not_blank')]
    #[Assert\Choice(callback: 'getAllowedGenders', message: 'create_user_command.gender.choice')]
    private ?string $gender = null;

    #[Assert\Length(min: 8, max: 50, minMessage: 'create_user_command.password.min_length', maxMessage: 'create_user_command.password.max_length')]
    #[Assert\Regex(pattern: '/^[^\s](?=.*[a-z])(?=.*[A-Z])(?=.*\d).+[^\s]$/', message: 'create_user_command.password.invalid')]
    #[Assert\NotCompromisedPassword(message: 'create_user_command.password.compromised')]
    private ?string $password = null;

    private bool $admin = false;

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(?string $uuid): self
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(?string $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function isAdmin(): bool
    {
        return $this->admin;
    }

    public function setIsAdmin(bool $admin): self
    {
        $this->admin = $admin;

        return $this;
    }

    public static function getAllowedGenders(): array
    {
        return array_map(static fn (Gender $gender) => $gender->value, Gender::cases());
    }
}
