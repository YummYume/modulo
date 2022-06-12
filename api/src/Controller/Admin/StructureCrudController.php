<?php

namespace App\Controller\Admin;

use App\Entity\Structure;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

final class StructureCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Structure::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle(Crud::PAGE_INDEX, 'view.structure.index')
            ->setPageTitle(Crud::PAGE_NEW, 'view.structure.create')
            ->setPageTitle(Crud::PAGE_EDIT, 'view.structure.edit')
            ->setPageTitle(Crud::PAGE_DETAIL, 'view.structure.detail')
            ->setEntityLabelInSingular('view.structure.single')
            ->setEntityLabelInPlural('view.structure.plural')
            ->setDefaultSort(['updatedAt' => 'DESC'])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'structure.name'),
            TextField::new('code', 'structure.code'),
            AssociationField::new('parentStructure', 'structure.parent_structure'),
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
