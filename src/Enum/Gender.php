<?php

namespace App\Enum;

use App\Enum\Traits\UtilsTrait;

enum Gender: string
{
    use UtilsTrait;

    case MALE = 'male';
    case FEMALE = 'female';
    case OTHER = 'other';
}
