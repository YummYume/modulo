<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use App\Repository\RoleRepository;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class CategoryCrudController extends AbstractCrudController
{
    public function __construct(private RoleRepository $roleRepository)
    {
    }

    public static function getEntityFqcn(): string
    {
        return Category::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'view.category.index')
            ->setPageTitle('new', 'view.category.create')
            ->setPageTitle('edit', 'view.category.edit')
            ->setPageTitle('detail', 'view.category.detail')
            ->setEntityLabelInSingular('view.category.single')
            ->setEntityLabelInPlural('view.category.plural')
            ->setDefaultSort(['updatedAt' => 'DESC'])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'category.name'),
            TextField::new('description', 'category.description'),
            AssociationField::new('invitedRoles', 'category.invitedRoles'),
            DateTimeField::new('createdAt', 'common.created_at')
                ->hideOnForm(),
            DateTimeField::new('updatedAt', 'common.updated_at')
                ->hideOnForm(),
            TextField::new('createdBy', 'common.created_by')
                ->hideOnForm(),
            TextField::new('updatedBy', 'common.updated_by')
                ->hideOnForm(),
        ];
    }
}
