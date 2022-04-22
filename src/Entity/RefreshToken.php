<?php

namespace App\Entity;

use App\Entity\Traits\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use Gesdinet\JWTRefreshTokenBundle\Entity\RefreshToken as BaseRefreshToken;

#[ORM\Entity()]
#[ORM\Table(name: '`refresh_tokens`')]
class RefreshToken extends BaseRefreshToken
{
    use TimestampableTrait;
}
