<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use App\Entity\Event;
use App\Entity\User;
use App\Enum\Visibility;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\Form\Extension\Core\Type\EnumType;

final class EventCrudController extends AbstractCrudController
{
    public function __construct(private AdminUrlGenerator $adminUrlGenerator)
    {
    }

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
            ->setTimezone('Europe/Paris')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'event.name'),
            TextareaField::new('description', 'event.description')
                ->hideOnIndex(),
            AssociationField::new('categories', 'event.categories')
                ->onlyOnForms(),
            AssociationField::new('roles', 'event.roles')
                ->onlyOnForms(),
            CollectionField::new('categories', 'event.categories')
                ->hideOnForm()
                ->formatValue(function (string $value, Event $event) use ($pageName): string {
                    if (CRUD::PAGE_INDEX === $pageName) {
                        return $event->getCategories()->count();
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
                    }, $event->getCategories()->toArray());

                    return implode(', ', $categories);
                }),
            AssociationField::new('participants', 'event.participants')
                ->autocomplete()
                ->onlyOnForms(),
            CollectionField::new('participants', 'event.participants')
                ->hideOnForm()
                ->formatValue(function (string $value, Event $event) use ($pageName): string {
                    if (CRUD::PAGE_INDEX === $pageName) {
                        return $event->getParticipants()->count();
                    }

                    $baseUrl = $this->adminUrlGenerator
                        ->unsetAll()
                        ->setController(UserCrudController::class)
                        ->setAction(Crud::PAGE_DETAIL)
                    ;

                    $users = array_map(function (User $participant) use ($baseUrl): string {
                        $url = $baseUrl
                            ->setEntityId($participant->getId())
                            ->generateUrl()
                        ;

                        return sprintf('<a href="%s">%s</a>', $url, $participant);
                    }, $event->getParticipants()->toArray());

                    return implode(', ', $users);
                }),
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
            DateTimeField::new('startDate', 'event.start_date'),
            DateTimeField::new('endDate', 'event.end_date'),
            BooleanField::new('active', 'event.active'),
            BooleanField::new('visible', 'event.visible'),
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
