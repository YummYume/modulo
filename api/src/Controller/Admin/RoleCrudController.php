<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use App\Entity\Role;
use App\Enum\Feature;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;

final class RoleCrudController extends AbstractCrudController
{
    public function __construct(private AdminUrlGenerator $adminUrlGenerator)
    {
    }

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
            ->setTimezone('Europe/Paris')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'role.name'),
            TextField::new('feminineName', 'role.feminine_name'),
            TextField::new('code', 'role.code'),
            AssociationField::new('ageSection', 'role.age_section'),
            AssociationField::new('categories', 'role.categories')
                ->onlyOnForms(),
            CollectionField::new('categories', 'role.categories')
                ->hideOnForm()
                ->formatValue(function (string $value, Role $role) use ($pageName): string {
                    if (CRUD::PAGE_INDEX === $pageName) {
                        return $role->getCategories()->count();
                    }

                    $baseUrl = $this->adminUrlGenerator
                        ->unsetAll()
                        ->setController(CategoryCrudController::class)
                        ->setAction(Crud::PAGE_DETAIL)
                    ;

                    $categories = array_map(function (Category $category) use ($baseUrl): string {
                        $url = $baseUrl
                            ->setEntityId($category->getId())
                            ->generateUrl()
                        ;

                        return sprintf('<a href="%s">%s</a>', $url, $category);
                    }, $role->getCategories()->toArray());

                    return implode(', ', $categories);
                }),
            ChoiceField::new('features', 'role.features')
                ->setChoices(Feature::toArray(true))
                ->renderExpanded()
                ->allowMultipleChoices()
                ->setFormTypeOption('error_bubbling', false)
                ->hideOnIndex(),
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
