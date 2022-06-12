<?php

namespace App\Controller\Admin;

use App\Entity\AgeSection;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ColorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

final class AgeSectionCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return AgeSection::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle(Crud::PAGE_INDEX, 'view.age_section.index')
            ->setPageTitle(Crud::PAGE_NEW, 'view.age_section.create')
            ->setPageTitle(Crud::PAGE_EDIT, 'view.age_section.edit')
            ->setPageTitle(Crud::PAGE_DETAIL, 'view.age_section.detail')
            ->setEntityLabelInSingular('view.age_section.single')
            ->setEntityLabelInPlural('view.age_section.plural')
            ->setDefaultSort(['updatedAt' => 'DESC'])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'age_section.name'),
            TextField::new('code', 'age_section.code'),
            ColorField::new('color', 'age_section.color'),
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
