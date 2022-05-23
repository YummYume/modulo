<?php

namespace App\Form\Admin;

use App\Entity\MediaFile;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Vich\UploaderBundle\Form\Type\VichFileType;

final class MediaFileType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('file', VichFileType::class, [
                'label' => false,
                'required' => false,
                'allow_delete' => true,
                'download_label' => true,
                'download_uri' => true,
                'asset_helper' => true,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => MediaFile::class,
            'help' => 'media_file.help',
        ]);
    }
}
