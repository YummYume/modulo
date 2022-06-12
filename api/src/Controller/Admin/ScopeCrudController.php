<?php

namespace App\Controller\Admin;

use App\Entity\Scope;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

final class ScopeCrudController extends AbstractCrudController
{
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
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            AssociationField::new('user', 'scope.user'),
            AssociationField::new('structure', 'scope.structure'),
            AssociationField::new('role', 'scope.role'),
            DateTimeField::new('createdAt', 'common.created_at')
                ->hideOnForm(),
            DateTimeField::new('updatedAt', 'common.updated_at')
                ->hideOnForm(),
            TextField::new('createdBy', 'common.created_by')
                ->hideOnForm(),
            TextField::new('updatedBy', 'common.updated_by')
                ->hideOnForm(),
            BooleanField::new('active', 'scope.active'),
        ];
    }
}
