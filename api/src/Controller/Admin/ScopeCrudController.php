<?php

namespace App\Controller\Admin;

use App\Entity\Scope;
use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;

final class ScopeCrudController extends AbstractCrudController
{
    public function __construct(private AdminUrlGenerator $adminUrlGenerator)
    {
    }

    public static function getEntityFqcn(): string
    {
        return Scope::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle(Crud::PAGE_INDEX, 'view.scope.index')
            ->setPageTitle(Crud::PAGE_NEW, 'view.scope.create')
            ->setPageTitle(Crud::PAGE_EDIT, 'view.scope.edit')
            ->setPageTitle(Crud::PAGE_DETAIL, 'view.scope.detail')
            ->setEntityLabelInSingular('view.scope.single')
            ->setEntityLabelInPlural('view.scope.plural')
            ->setDefaultSort(['updatedAt' => 'DESC'])
            ->setTimezone('Europe/Paris')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            AssociationField::new('users', 'scope.users')
                ->onlyOnForms()
                ->autocomplete()
                ->setFormTypeOption('by_reference', false),
            CollectionField::new('users', 'scope.users')
                ->hideOnForm()
                ->formatValue(function (string $value, Scope $scope) use ($pageName): string {
                    if (CRUD::PAGE_INDEX === $pageName) {
                        return $scope->getUsers()->count();
                    }

                    $baseUrl = $this->adminUrlGenerator
                        ->unsetAll()
                        ->setController(UserCrudController::class)
                        ->setAction(Crud::PAGE_DETAIL)
                    ;

                    $users = array_map(function (User $user) use ($baseUrl): string {
                        $url = $baseUrl
                            ->setEntityId($user->getId())
                            ->generateUrl()
                        ;

                        return sprintf('<a href="%s">%s</a>', $url, $user);
                    }, $scope->getUsers()->toArray());

                    return implode(', ', $users);
                }),
            AssociationField::new('structure', 'scope.structure'),
            AssociationField::new('role', 'scope.role'),
            BooleanField::new('active', 'scope.active'),
            DateTimeField::new('createdAt', 'common.created_at')
                ->hideOnForm(),
            DateTimeField::new('updatedAt', 'common.updated_at')
                ->hideOnForm(),
            AssociationField::new('createdBy', 'common.created_by')
                ->hideOnForm(),
            AssociationField::new('updatedBy', 'common.updated_by')
                ->hideOnForm(),
        ];
    }
}
