<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use App\Repository\RoleRepository;
use Doctrine\ORM\QueryBuilder;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

final class CategoryCrudController extends AbstractCrudController
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
            ->setPageTitle(Crud::PAGE_INDEX, 'view.category.index')
            ->setPageTitle(Crud::PAGE_NEW, 'view.category.create')
            ->setPageTitle(Crud::PAGE_EDIT, 'view.category.edit')
            ->setPageTitle(Crud::PAGE_DETAIL, 'view.category.detail')
            ->setEntityLabelInSingular('view.category.single')
            ->setEntityLabelInPlural('view.category.plural')
            ->setDefaultSort(['updatedAt' => 'DESC'])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'category.name'),
            TextareaField::new('description', 'category.description'),
            AssociationField::new('invitedRoles', 'category.invited_roles')
                ->setQueryBuilder(function (QueryBuilder $qb): QueryBuilder {
                    $category = $this->getContext()->getEntity()->getInstance();

                    return $qb
                        ->andWhere($qb->expr()->isMemberOf(':category', 'entity.categories'))
                        ->setParameter('category', $category)
                    ;
                })
                ->setFormTypeOption('help', 'category.invited_roles.help')
                ->hideWhenCreating(),
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
