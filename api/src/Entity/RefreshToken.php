<?php

namespace App\Entity;

use App\Entity\Traits\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use Gesdinet\JWTRefreshTokenBundle\Entity\RefreshTokenRepository;
use Gesdinet\JWTRefreshTokenBundle\Model\AbstractRefreshToken;

#[ORM\Entity(repositoryClass: RefreshTokenRepository::class)]
#[ORM\Table(name: '`refresh_tokens`')]
class RefreshToken extends AbstractRefreshToken
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\Column(name: 'id', type: 'integer', nullable: false)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    protected $id;

    #[ORM\Column(name: 'refresh_token', type: 'string', nullable: false)]
    protected $refreshToken;

    #[ORM\Column(name: 'uuid', type: 'string', nullable: false)]
    protected $username;

    #[ORM\Column(name: 'valid', type: 'datetime', nullable: false)]
    protected $valid;

    /**
     * {@inheritdoc}
     */
    public function getId()
    {
        return $this->id;
    }
}
