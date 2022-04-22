<?php

namespace App\Controller\Admin;

use App\Entity\Scope;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class ScopeCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Scope::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'view.scope.index')
            ->setPageTitle('new', 'view.scope.create')
            ->setPageTitle('edit', 'view.scope.edit')
            ->setPageTitle('detail', 'view.scope.detail')
            ->setEntityLabelInSingular('view.scope.single')
            ->setEntityLabelInPlural('view.scope.plural')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            AssociationField::new('user', 'scope.user'),
            AssociationField::new('structure', 'scope.structure'),
            AssociationField::new('role', 'scope.role'),
            DateTimeField::new('createdAt', 'common.created_at')
                ->onlyOnIndex(),
            DateTimeField::new('updatedAt', 'common.updated_at')
                ->onlyOnIndex(),
            TextField::new('createdBy', 'common.created_by')
                ->onlyOnIndex(),
            TextField::new('updatedBy', 'common.updated_by')
                ->onlyOnIndex(),
            BooleanField::new('active', 'scope.active'),
        ];
    }
}
