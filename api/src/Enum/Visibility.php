<?php

namespace App\Enum;

use App\Enum\Traits\UtilsTrait;

enum Visibility: string
{
    use UtilsTrait;

    case PUBLIC_ACCESS = 'public_access';
    case RESTRICTED_ACCESS = 'restricted_access';
    case PRIVATE_ACCESS = 'private_access';
}
