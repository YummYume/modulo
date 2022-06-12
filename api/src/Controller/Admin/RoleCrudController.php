<?php

namespace App\Controller\Admin;

use App\Entity\Role;
use App\Enum\Feature;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

final class RoleCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Role::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle(Crud::PAGE_INDEX, 'view.role.index')
            ->setPageTitle(Crud::PAGE_NEW, 'view.role.create')
            ->setPageTitle(Crud::PAGE_EDIT, 'view.role.edit')
            ->setPageTitle(Crud::PAGE_DETAIL, 'view.role.detail')
            ->setEntityLabelInSingular('view.role.single')
            ->setEntityLabelInPlural('view.role.plural')
            ->setDefaultSort(['updatedAt' => 'DESC'])
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
            ChoiceField::new('features', 'role.features')
                ->setChoices(Feature::toArray(true))
                ->allowMultipleChoices()
                ->setFormTypeOption('error_bubbling', false)
                ->formatValue(static function (string $value) use ($pageName): string {
                    if (Crud::PAGE_INDEX !== $pageName) {
                        return $value;
                    }

                    return 150 < \strlen($value) ? substr($value, 0, 150).'...' : $value;
                }),
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
