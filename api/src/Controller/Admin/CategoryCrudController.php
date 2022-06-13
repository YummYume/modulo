<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use App\Entity\Role;
use App\Repository\RoleRepository;
use Doctrine\ORM\QueryBuilder;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;

final class CategoryCrudController extends AbstractCrudController
{
    public function __construct(private RoleRepository $roleRepository, private AdminUrlGenerator $adminUrlGenerator)
    {
    }

    public static function getEntityFqcn(): string
    {
        return Category::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle(Crud::PAGE_INDEX, 'view.category.index')
            ->setPageTitle(Crud::PAGE_NEW, 'view.category.create')
            ->setPageTitle(Crud::PAGE_EDIT, 'view.category.edit')
            ->setPageTitle(Crud::PAGE_DETAIL, 'view.category.detail')
            ->setEntityLabelInSingular('view.category.single')
            ->setEntityLabelInPlural('view.category.plural')
            ->setDefaultSort(['updatedAt' => 'DESC'])
            ->setTimezone('Europe/Paris')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'category.name'),
            TextareaField::new('description', 'category.description'),
            AssociationField::new('roles', 'category.roles')
                ->setFormTypeOption('by_reference', false)
                ->onlyOnForms(),
            CollectionField::new('roles', 'category.roles')
                ->hideOnForm()
                ->formatValue(function (string $count, Category $category) use ($pageName): string {
                    if (CRUD::PAGE_INDEX === $pageName) {
                        return $category->getRoles()->count();
                    }

                    $baseUrl = $this->adminUrlGenerator
                        ->unsetAll()
                        ->setController(RoleCrudController::class)
                        ->setAction(Crud::PAGE_DETAIL)
                    ;

                    $roles = array_map(function (Role $role) use ($baseUrl): string {
                        $url = $baseUrl
                            ->setEntityId($role->getId())
                            ->generateUrl()
                        ;

                        return sprintf('<a href="%s">%s</a>', $url, $role);
                    }, $category->getRoles()->toArray());

                    return implode(', ', $roles);
                }),
            AssociationField::new('invitedRoles', 'category.invited_roles')
                ->setQueryBuilder(function (QueryBuilder $qb): QueryBuilder {
                    $category = $this->getContext()->getEntity()->getInstance();

                    return $qb
                        ->andWhere($qb->expr()->isMemberOf(':category', 'entity.categories'))
                        ->setParameter('category', $category)
                    ;
                })
                ->setFormTypeOption('help', 'category.invited_roles.help')
                ->onlyWhenUpdating(),
            CollectionField::new('invitedRoles', 'category.invited_roles')
                ->hideOnForm()
                ->formatValue(function (string $value, Category $category) use ($pageName): string {
                    if (CRUD::PAGE_INDEX === $pageName) {
                        return $category->getInvitedRoles()->count();
                    }

                    $baseUrl = $this->adminUrlGenerator
                        ->unsetAll()
                        ->setController(RoleCrudController::class)
                        ->setAction(Crud::PAGE_DETAIL)
                    ;

                    $invitedRoles = array_map(function (Role $role) use ($baseUrl): string {
                        $url = $baseUrl
                            ->setEntityId($role->getId())
                            ->generateUrl()
                        ;

                        return sprintf('<a href="%s">%s</a>', $url, $role);
                    }, $category->getInvitedRoles()->toArray());

                    return implode(', ', $invitedRoles);
                }),
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
