<?php

namespace App\Entity\Traits;

use App\Entity\Scope;

trait CurrentScopeableTrait
{
    private ?Scope $currentScope = null;

    public function getCurrentScope(): ?Scope
    {
        return $this->currentScope;
    }

    public function setCurrentScope(?Scope $currentScope): self
    {
        $this->currentScope = $currentScope;

        return $this;
    }
}
