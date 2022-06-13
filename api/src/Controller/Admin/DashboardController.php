<?php

namespace App\Controller\Admin;

use App\Entity\AgeSection;
use App\Entity\Category;
use App\Entity\Event;
use App\Entity\Role;
use App\Entity\Scope;
use App\Entity\Structure;
use App\Entity\User;
use App\Repository\CategoryRepository;
use App\Repository\EventRepository;
use App\Service\Disk\DiskManager;
use App\Service\Utility\ChartJsHelper;
use App\Service\Utility\ColorGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Assets;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\UserMenu;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\UX\Chartjs\Builder\ChartBuilderInterface;
use Symfony\UX\Chartjs\Model\Chart;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

final class DashboardController extends AbstractDashboardController
{
    public function __construct(
        private TranslatorInterface $translator,
        private UploaderHelper $uploaderHelper,
        private CacheManager $imagineCacheManager,
        private DiskManager $diskManager,
        private KernelInterface $kernel,
        private ChartBuilderInterface $chartBuilder,
        private CategoryRepository $categoryRepository,
        private EventRepository $eventRepository,
        private ParameterBagInterface $parameterBag
    ) {
    }

    #[Route('/', name: 'admin', host: '%host_domain_admin%')]
    public function index(): Response
    {
        $mediaDir = $this->kernel->getProjectDir().'/public/media';
        $to = new \DateTimeImmutable('today 23:59:59');
        $since = $to->sub(new \DateInterval('P2W'));
        $activeEventsCount = $this->eventRepository->findEventCountByActiveAndInactive();
        $categoriesByEvents = $this->categoryRepository->findByEventCount();
        $recentEventsCount = $this->eventRepository->findByCountAndDate($since, $to);
        $recentEventsCount = array_merge(
            ChartJsHelper::fillDatesBetween(
                $since,
                new \DateTimeImmutable('tomorrow'),
                excludeDates: array_map(static fn (array $event): string => $event['x'], $recentEventsCount)
            ),
            $recentEventsCount
        );

        usort($recentEventsCount, static fn (array $a, array $b): int => $a['x'] <=> $b['x']);

        $activeEventsChart = ($this->chartBuilder->createChart(Chart::TYPE_PIE))
            ->setData([
                'labels' => array_map(
                    fn (string $key): string => $this->translator->trans("dashboard.chart.active_events_count.$key"),
                    array_keys($activeEventsCount)
                ),
                'datasets' => [
                    [
                        'label' => 'Active',
                        'data' => array_values($activeEventsCount),
                        'backgroundColor' => $activeEventsColors = array_map(
                            static fn (string $item): string => ColorGenerator::generateColorFromValue($item),
                            array_values($activeEventsCount)
                        ),
                        'borderColor' => $activeEventsColors,
                    ],
                ],
            ])
            ->setOptions([
                'responsive' => true,
            ])
        ;

        $categoriesChart = ($this->chartBuilder->createChart(Chart::TYPE_BAR))
            ->setData([
                'labels' => array_map(static fn (array $category): string => $category['name'], $categoriesByEvents),
                'datasets' => [
                    [
                        'label' => $this->translator->trans('dashboard.chart.categories_by_event_count.events'),
                        'data' => array_map(static fn (array $category): int => $category['eventCount'], $categoriesByEvents),
                        'backgroundColor' => array_map(
                            fn (array $category): string => ColorGenerator::generateColorFromValue($category['name']),
                            $categoriesByEvents
                        ),
                    ],
                ],
            ])
            ->setOptions([
                'responsive' => true,
                'scales' => [
                    'y' => [
                        'beginAtZero' => true,
                    ],
                ],
                'scale' => [
                    'ticks' => [
                        'precision' => 0,
                    ],
                ],
                'indexAxis' => \count($categoriesByEvents) > 20 ? 'y' : 'x',
                'plugins' => [
                    'legend' => [
                        'display' => false,
                    ],
                ],
            ])
        ;

        $recentEventsCountChart = ($this->chartBuilder->createChart(Chart::TYPE_LINE))
            ->setData([
                'datasets' => [
                    [
                        'label' => $this->translator->trans('dashboard.chart.recent_events_count.events'),
                        'data' => $recentEventsCount,
                        'borderColor' => $recentEventsColor = ColorGenerator::generateRandomColor(),
                        'backgroundColor' => $recentEventsColor,
                        'fill' => false,
                    ],
                ],
            ])
            ->setOptions([
                'responsive' => true,
                'scales' => [
                    'x' => [
                        'type' => 'time',
                        'time' => [
                            'unit' => 'day',
                            'format' => 'YYYY-MM-DD',
                            'displayFormats' => [
                                'day' => 'dd MMM',
                            ],
                            'tooltipFormat' => 'dd MMM yyyy',
                        ],
                        'min' => $since->format('Y-m-d'),
                        'max' => $to->format('Y-m-d'),
                    ],
                ],
                'scale' => [
                    'ticks' => [
                        'precision' => 0,
                    ],
                ],
            ])
        ;

        return $this->render('admin/dashboard.html.twig', [
            'diskTotalSpace' => $this->diskManager->getDiskTotalSpace(),
            'diskFreeSpace' => $this->diskManager->getDiskFreeSpace(),
            'diskUsedSpace' => $this->diskManager->getDiskUsedSpace(),
            'diskUsedPercentage' => $this->diskManager->getDiskUsedPercentage(),
            'diskMediaFolderUsedSpace' => $this->diskManager->getPathUsedSpace($mediaDir),
            'diskMediaFolderUsedPercentage' => $this->diskManager->getPathUsedPercentage($mediaDir),
            'categoriesCountChart' => $categoriesChart,
            'recentEventsCountChart' => $recentEventsCountChart,
            'activeEventsChart' => $activeEventsChart,
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
        yield MenuItem::linkToCrud('view.admin.role', 'fas fa-user-tag', Role::class);
        yield MenuItem::linkToCrud('view.admin.structure', 'fas fa-people-roof', Structure::class);
        yield MenuItem::linkToCrud('view.admin.user', 'fas fa-users', User::class);
        yield MenuItem::linkToCrud('view.admin.event', 'fas fa-calendar-alt', Event::class);
        yield MenuItem::linkToCrud('view.admin.category', 'fas fa-list-ul', Category::class);
        yield MenuItem::linkToCrud('view.admin.age_section', 'fas fa-portrait', AgeSection::class);
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
            ->addMenuItems([
                MenuItem::linkToUrl('view.public_site', 'fas fa-home', $this->parameterBag->get('public_site_url')),
            ])
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
