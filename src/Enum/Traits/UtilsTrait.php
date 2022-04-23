<?php

namespace App\Enum\Traits;

trait UtilsTrait
{
    public static function random(): self
    {
        return self::cases()[array_rand(self::cases())];
    }

    public static function toArray(): array
    {
        return array_combine(
            array_map(static fn (self $role): string => $role->name, self::cases()),
            array_map(static fn (self $role): string => $role->value, self::cases()),
        );
    }
}
