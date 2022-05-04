<?php

namespace App\Controller\Admin;

use App\Entity\Role;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class RoleCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Role::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'view.role.index')
            ->setPageTitle('new', 'view.role.create')
            ->setPageTitle('edit', 'view.role.edit')
            ->setPageTitle('detail', 'view.role.detail')
            ->setEntityLabelInSingular('view.role.single')
            ->setEntityLabelInPlural('view.role.plural')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'role.name'),
            TextField::new('feminineName', 'role.feminine_name'),
            TextField::new('code', 'role.code'),
            AssociationField::new('ageSection', 'role.age_section'),
            AssociationField::new('categories', 'role.categories'),
            DateTimeField::new('createdAt', 'common.created_at')
                ->onlyOnIndex(),
            DateTimeField::new('updatedAt', 'common.updated_at')
                ->onlyOnIndex(),
            TextField::new('createdBy', 'common.created_by')
                ->onlyOnIndex(),
            TextField::new('updatedBy', 'common.updated_by')
                ->onlyOnIndex(),
        ];
    }
}