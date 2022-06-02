<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use App\Entity\Event;
use App\Entity\Role;
use App\Entity\Scope;
use App\Entity\User;
use App\Service\Disk\DiskManager;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Assets;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\UserMenu;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

class DashboardController extends AbstractDashboardController
{
    public function __construct(
        private TranslatorInterface $translator,
        private UploaderHelper $uploaderHelper,
        private CacheManager $imagineCacheManager,
        private DiskManager $diskManager,
        private KernelInterface $kernel
    ) {
    }

    #[Route('/', name: 'admin', host: '%host_domain_admin%')]
    public function index(): Response
    {
        $mediaDir = $this->kernel->getProjectDir().'/public/media';

        return $this->render('admin/dashboard.html.twig', [
            'diskTotalSpace' => $this->diskManager->getDiskTotalSpace(),
            'diskFreeSpace' => $this->diskManager->getDiskFreeSpace(),
            'diskUsedSpace' => $this->diskManager->getDiskUsedSpace(),
            'diskUsedPercentage' => $this->diskManager->getDiskUsedPercentage(),
            'diskMediaFolderUsedSpace' => $this->diskManager->getPathUsedSpace($mediaDir),
            'diskMediaFolderUsedPercentage' => $this->diskManager->getPathUsedPercentage($mediaDir),
        ]);
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
        $userAvatar = null;

        if (null !== $user->getAvatar()?->getImageName()) {
            $userAvatar = $this->uploaderHelper->asset($user->getAvatar(), 'image');
            $userAvatar = $this->imagineCacheManager->getBrowserPath($userAvatar, 'avatar');
        }

        return parent::configureUserMenu($user)
            ->setName($user->getFullName())
            ->setAvatarUrl($userAvatar)
        ;
    }

    public function configureActions(): Actions
    {
        return parent::configureActions()
            ->add(Crud::PAGE_INDEX, Action::DETAIL)
        ;
    }

    public function configureAssets(): Assets
    {
        return Assets::new()
            ->addWebpackEncoreEntry('admin')
        ;
    }
}
