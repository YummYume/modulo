<?php

namespace App\Controller\Admin;

use App\Entity\Event;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
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
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'event.name'),
            TextField::new('description', 'event.description'),
            AssociationField::new('categories', 'event.categories'),
            AssociationField::new('participants', 'event.participants'),
            DateTimeField::new('startDate', 'event.start_date'),
            DateTimeField::new('endDate', 'event.end_date'),
            BooleanField::new('active', 'event.active'),
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
