<?php

namespace App\Form\Admin;

use App\Entity\Role;
use App\Entity\Scope;
use App\Entity\Structure;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

final class UserScopeFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('structure', EntityType::class, [
                'class' => Structure::class,
                'choice_label' => 'name',
                'label' => 'scope.structure',
            ])
            ->add('role', EntityType::class, [
                'class' => Role::class,
                'choice_label' => 'name',
                'label' => 'scope.role',
            ])
            ->add('active', CheckboxType::class, [
                'label' => 'scope.active',
                'label_attr' => ['style' => 'margin-top: auto;'],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Scope::class,
            'error_bubbling' => false,
            'error_mapping' => [
                '.' => 'structure',
            ],
        ]);
    }
}
