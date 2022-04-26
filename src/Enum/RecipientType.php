<?php

namespace App\Enum;

use App\Enum\Traits\UtilsTrait;

enum RecipientType: string
{
    use UtilsTrait;

    case MAIN = 'main';
    case CARBON_COPY = 'carbon_copy';
    case BLIND_CARBON_COPY = 'blind_carbon_copy';
}
