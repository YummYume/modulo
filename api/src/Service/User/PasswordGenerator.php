<?php

namespace App\Service\User;

class PasswordGenerator
{
    public const digits = '0123456789';
    public const letters = 'abcdefghijklmnopqrstuvwxyz';
    public const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    public const specialChars = '@$?!#';

    public function generate(int $length = 8): string
    {
        if ($length < 8 || $length > 20) {
            throw new \RangeException('Password length must lay between 8 and 20.');
        }

        $pieces = [];

        try {
            foreach (range(0, $length) as $i) {
                $progress = ($i * 100) / $length;

                if ($progress < 25) {
                    $pieces[] = $this->getRandomChar(self::digits);
                } elseif ($progress < 50) {
                    $pieces[] = $this->getRandomChar(self::letters);
                } elseif ($progress < 75) {
                    $pieces[] = $this->getRandomChar(self::upperLetters);
                } else {
                    $pieces[] = $this->getRandomChar(self::specialChars);
                }
            }
            shuffle($pieces);
        } catch (\Exception $exception) {
            throw new \LogicException();
        }

        return implode('', $pieces);
    }

    private function getRandomChar(string $charSet): string
    {
        return $charSet[random_int(0, mb_strlen($charSet, '8bit') - 1)];
    }
}
