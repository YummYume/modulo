<?php

namespace App\Controller\Admin;

use App\Entity\Structure;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;

final class StructureCrudController extends AbstractCrudController
{
    public function __construct(private AdminUrlGenerator $adminUrlGenerator)
    {
    }

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
            ->setTimezone('Europe/Paris')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'structure.name'),
            TextField::new('code', 'structure.code'),
            AssociationField::new('parentStructure', 'structure.parent_structure'),
            AssociationField::new('childStructures', 'structure.child_structures')
                ->setFormTypeOption('by_reference', false)
                ->onlyOnForms(),
            CollectionField::new('childStructures', 'structure.child_structures')
                ->hideOnForm()
                ->formatValue(function (string $value, Structure $structure) use ($pageName): string {
                    if (CRUD::PAGE_INDEX === $pageName) {
                        return $structure->getChildStructures()->count();
                    }

                    $baseUrl = $this->adminUrlGenerator
                        ->unsetAll()
                        ->setController(self::class)
                        ->setAction(Crud::PAGE_DETAIL)
                    ;

                    $childStructures = array_map(function (Structure $childStructure) use ($baseUrl): string {
                        $url = $baseUrl
                            ->setEntityId($childStructure->getId())
                            ->generateUrl()
                        ;

                        return sprintf('<a href="%s">%s</a>', $url, $childStructure);
                    }, $structure->getChildStructures()->toArray());

                    return implode(', ', $childStructures);
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
