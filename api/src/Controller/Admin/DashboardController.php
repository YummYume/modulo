<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use App\Entity\Event;
use App\Entity\Role;
use App\Entity\Scope;
use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\UserMenu;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class DashboardController extends AbstractDashboardController
{
    public function __construct(private TranslatorInterface $translator)
    {
    }

    #[Route('/', name: 'admin', host: '%host_domain_admin%')]
    public function index(): Response
    {
        return $this->render('admin/dashboard.html.twig');
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle($this->translator->trans('common.app_name'))
            ->setFaviconPath('favicon.ico')
        ;
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('view.admin.dashboard', 'fa fa-home');
        yield MenuItem::linkToCrud('view.admin.scope', 'fas fa-users-cog', Scope::class);
        yield MenuItem::linkToCrud('view.admin.category', 'fas fa-list-ul', Category::class);
        yield MenuItem::linkToCrud('view.admin.role', 'fas fa-user-tag', Role::class);
        yield MenuItem::linkToCrud('view.admin.user', 'fas fa-users', User::class);
        yield MenuItem::linkToCrud('view.admin.event', 'fas fa-calendar-alt', Event::class);
    }

    public function configureUserMenu(UserInterface|User $user): UserMenu
    {
        return parent::configureUserMenu($user)
            ->setName($user->getFullName())
        ;
    }
}
