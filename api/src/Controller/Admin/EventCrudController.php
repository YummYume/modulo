<?php

namespace App\Controller\Admin;

use App\Entity\Event;
use App\Enum\Visibility;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Form\Extension\Core\Type\EnumType;

final class EventCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Event::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle(Crud::PAGE_INDEX, 'view.event.index')
            ->setPageTitle(Crud::PAGE_NEW, 'view.event.create')
            ->setPageTitle(Crud::PAGE_EDIT, 'view.event.edit')
            ->setPageTitle(Crud::PAGE_DETAIL, 'view.event.detail')
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
            ChoiceField::new('visibility', 'event.visibility')
                ->hideOnForm()
                ->setChoices(static function () {
                    $choices = array_map(static fn (?Visibility $unit) => [$unit->value => $unit->name], Visibility::cases());

                    return array_merge(...$choices);
                })
                ->setFormType(EnumType::class)
                ->setFormTypeOptions([
                    'class' => Visibility::class,
                    'choice_label' => static fn (Visibility $visibility): string => $visibility->value,
                ])
                ->formatValue(static fn (string $visibility): string => $visibility),
            ChoiceField::new('visibility', 'event.visibility')
                ->onlyOnForms()
                ->setChoices(static function () {
                    $choices = array_map(static fn (?Visibility $unit) => [$unit->value => $unit], Visibility::cases());

                    return array_merge(...$choices);
                })
                ->setFormType(EnumType::class)
                ->setFormTypeOptions([
                    'class' => Visibility::class,
                    'choice_label' => static fn (Visibility $visibility): string => $visibility->value,
                ]),
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
