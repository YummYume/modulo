<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Enum\Gender;
use App\Enum\StaticRole;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Contracts\Translation\TranslatorInterface;

class UserCrudController extends AbstractCrudController
{
    public function __construct(private TranslatorInterface $translator)
    {
    }

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'view.user.index')
            ->setPageTitle('new', 'view.user.create')
            ->setPageTitle('edit', 'view.user.edit')
            ->setPageTitle('detail', 'view.user.detail')
            ->setEntityLabelInSingular('view.user.single')
            ->setEntityLabelInPlural('view.user.plural')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('uuid', 'user.uuid'),
            EmailField::new('email', 'user.email'),
            ChoiceField::new('roles', 'user.roles')
                ->setChoices(StaticRole::toArray(true))
                ->allowMultipleChoices()
                ->onlyOnForms(),
            ChoiceField::new('roles', 'user.roles')
                ->onlyOnIndex()
                ->setChoices(StaticRole::toArray(true))
                ->allowMultipleChoices(),
            TextField::new('firstName', 'user.first_name'),
            TextField::new('lastName', 'user.last_name'),
            ChoiceField::new('gender', 'user.gender')
                ->onlyOnIndex()
                ->setChoices(function () {
                    $choices = array_map(static fn (?Gender $unit) => [$unit->value => $unit->name], Gender::cases());

                    return array_merge(...$choices);
                })
                ->setFormType(EnumType::class)
                ->setFormTypeOption('class', Gender::class)
                ->setFormTypeOption('choice_label', fn (Gender $gender) => $gender->value)
                ->formatValue(fn (string $gender) => $gender),
            ChoiceField::new('gender', 'user.gender')
                ->onlyOnForms()
                ->setChoices(function () {
                    $choices = array_map(static fn (?Gender $unit) => [$unit->value => $unit], Gender::cases());

                    return array_merge(...$choices);
                })
                ->setFormType(EnumType::class)
                ->setFormTypeOption('class', Gender::class)
                ->setFormTypeOption('choice_label', fn (Gender $gender) => $gender->value),
            AssociationField::new('scopes', 'user.scopes'),
            TextField::new('plainPassword', 'user.password')
                ->setFormType(RepeatedType::class)
                ->setFormTypeOptions([
                    'type' => PasswordType::class,
                    'invalid_message' => 'user.password.mismatch',
                    'constraints' => [
                        new NotBlank(allowNull: false, message: 'user.password.not_blank'),
                    ],
                    'options' => ['attr' => ['class' => 'password-field']],
                    'required' => true,
                    'first_options' => [
                        'label' => 'user.password',
                        'row_attr' => ['class' => 'password-field col-md-6'],
                    ],
                    'second_options' => [
                        'label' => 'user.password_repeat',
                        'row_attr' => ['class' => 'password-field col-md-6'],
                    ],
                ])
                ->onlyWhenCreating(),
            TextField::new('plainPassword', 'user.password')
                ->setFormType(RepeatedType::class)
                ->setFormTypeOptions([
                    'type' => PasswordType::class,
                    'invalid_message' => 'user.password.mismatch',
                    'options' => ['attr' => ['class' => 'password-field']],
                    'required' => false,
                    'first_options' => [
                        'label' => 'user.password',
                        'row_attr' => ['class' => 'password-field col-md-6'],
                    ],
                    'second_options' => [
                        'label' => 'user.password_repeat',
                        'row_attr' => ['class' => 'password-field col-md-6'],
                    ],
                ])
                ->onlyWhenUpdating(),
            DateTimeField::new('createdAt', 'common.created_at')
                ->onlyOnIndex(),
            DateTimeField::new('updatedAt', 'common.updated_at')
                ->onlyOnIndex(),
            TextField::new('createdBy', 'common.created_by')
                ->onlyOnIndex(),
            TextField::new('updatedBy', 'common.updated_by')
                ->onlyOnIndex(),
        ];
    }
}
