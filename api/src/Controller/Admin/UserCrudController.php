<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Enum\Gender;
use App\Enum\StaticRole;
use App\Form\Admin\MediaImageType;
use App\Form\Admin\UserScopeFormType;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AvatarField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Contracts\Translation\TranslatorInterface;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

class UserCrudController extends AbstractCrudController
{
    public function __construct(
        private TranslatorInterface $translator,
        private UploaderHelper $uploaderHelper,
        private CacheManager $imagineCacheManager
    ) {
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
            ->setDefaultSort(['updatedAt' => 'DESC'])
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
                ->hideOnForm()
                ->setChoices(StaticRole::toArray(true))
                ->allowMultipleChoices(),
            TextField::new('firstName', 'user.first_name'),
            TextField::new('lastName', 'user.last_name'),
            TextareaField::new('description', 'user.description')
                ->hideOnIndex()
                ->setRequired(false),
            ChoiceField::new('gender', 'user.gender')
                ->hideOnForm()
                ->setChoices(function () {
                    $choices = array_map(static fn (?Gender $unit) => [$unit->value => $unit->name], Gender::cases());

                    return array_merge(...$choices);
                })
                ->setFormType(EnumType::class)
                ->setFormTypeOption('class', Gender::class)
                ->setFormTypeOption('choice_label', fn (Gender $gender) => $gender->value)
                ->formatValue(static fn (string $gender): string => $gender),
            ChoiceField::new('gender', 'user.gender')
                ->onlyOnForms()
                ->setChoices(function () {
                    $choices = array_map(static fn (?Gender $unit) => [$unit->value => $unit], Gender::cases());

                    return array_merge(...$choices);
                })
                ->setFormType(EnumType::class)
                ->setFormTypeOption('class', Gender::class)
                ->setFormTypeOption('choice_label', fn (Gender $gender) => $gender->value),
            AvatarField::new('avatar', 'user.avatar')
                ->onlyOnIndex()
                ->formatValue(function (?string $path, User $user): ?string {
                    if (null === $path || null === $user->getAvatar()) {
                        return null;
                    }

                    $avatarPath = $this->uploaderHelper->asset($user->getAvatar(), 'image');

                    return $this->imagineCacheManager->getBrowserPath($avatarPath, 'thumbnail_preview_small');
                }),
            AvatarField::new('avatar', 'user.avatar')
                ->onlyOnDetail()
                ->formatValue(function (?string $path, User $user): ?string {
                    if (null === $path || null === $user->getAvatar()) {
                        return null;
                    }

                    $avatarPath = $this->uploaderHelper->asset($user->getAvatar(), 'image');

                    return $this->imagineCacheManager->getBrowserPath($avatarPath, 'avatar');
                }),
            TextField::new('avatar', 'user.avatar')
                ->onlyOnForms()
                ->setFormType(MediaImageType::class),
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
                        'label' => 'user.new_password',
                        'row_attr' => ['class' => 'password-field col-md-6'],
                    ],
                    'second_options' => [
                        'label' => 'user.new_password_repeat',
                        'row_attr' => ['class' => 'password-field col-md-6'],
                    ],
                ])
                ->onlyWhenUpdating(),
            AssociationField::new('scopes', 'user.scopes')
                ->hideOnForm(),
            CollectionField::new('scopes', 'user.scopes')
                ->allowAdd()
                ->allowDelete()
                ->setEntryType(UserScopeFormType::class)
                ->renderExpanded()
                ->setFormTypeOption('error_bubbling', false)
                ->onlyOnForms(),
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
