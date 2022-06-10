<?php

namespace App\Service\Utility;

final class ColorGenerator
{
    public static function generateRandomColor(): string
    {
        return '#'.str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', \STR_PAD_LEFT);
    }

    public static function generateColorFromValue(string|float|int $id): string
    {
        return '#'.substr(md5($id), 0, 6);
    }
}
