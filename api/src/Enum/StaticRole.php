<?php

namespace App\Enum;

use App\Enum\Traits\UtilsTrait;

enum StaticRole: string
{
    use UtilsTrait;

    case ROLE_SUPER_ADMIN = 'role_super_admin';
    case ROLE_ADMIN = 'role_admin';
    case ROLE_USER = 'role_user';
}
