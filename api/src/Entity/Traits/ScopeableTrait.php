<?php

namespace App\Entity\Traits;

use App\Entity\Scope;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

trait ScopeableTrait
{
    #[ORM\ManyToOne(targetEntity: Scope::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: 'scope.not_null')]
    #[Assert\Valid]
    #[Groups(['event:get'])]
    private ?Scope $scope = null;

    public function getScope(): ?Scope
    {
        return $this->scope;
    }

    public function setScope(?Scope $scope): self
    {
        $this->scope = $scope;

        return $this;
    }
}
