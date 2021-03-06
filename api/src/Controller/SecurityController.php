<?php

namespace App\Controller;

use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends AbstractController
{
    #[Route('/logout', name: 'logout', methods: ['GET'], host: '%host_domain_admin%')]
    public function logout(): void
    {
        throw new Exception('Please check that logout is configured in security.yaml');
    }
}
