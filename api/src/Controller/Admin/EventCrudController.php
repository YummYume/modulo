<?php

namespace App\Controller\Admin;

use App\Entity\Event;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class EventCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Event::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'view.event.index')
            ->setPageTitle('new', 'view.event.create')
            ->setPageTitle('edit', 'view.event.edit')
            ->setPageTitle('detail', 'view.event.detail')
            ->setEntityLabelInSingular('view.event.single')
            ->setEntityLabelInPlural('view.event.plural')
            ->setDefaultSort(['updatedAt' => 'DESC'])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'event.name'),
            TextareaField::new('description', 'event.description'),
            AssociationField::new('categories', 'event.categories'),
            AssociationField::new('roles', 'event.roles'),
            AssociationField::new('users', 'event.users'),
            AssociationField::new('scope', 'event.scope'),
            DateTimeField::new('startDate', 'event.start_date')->renderAsChoice(),
            DateTimeField::new('endDate', 'event.end_date')->renderAsChoice(),
            BooleanField::new('active', 'event.active'),
            BooleanField::new('visible', 'event.visible'),
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
