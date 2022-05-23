<?php

namespace App\Form\Admin;

use App\Entity\MediaImage;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Vich\UploaderBundle\Form\Type\VichImageType;

final class MediaImageType extends AbstractType
{
    public function __construct(private CacheManager $imagineCacheManager)
    {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $uriFilter = $options['uri_filter'];
        $getCachedPicture = function (MediaImage $media, ?string $resolvedUri) use ($uriFilter) {
            if (null === $resolvedUri) {
                return false;
            }

            if (!\is_string($uriFilter)) {
                $uriFilter = 'thumbnail_preview';
            }

            return $this->imagineCacheManager->getBrowserPath($resolvedUri, $uriFilter);
        };

        $builder
            ->add('image', VichImageType::class, [
                'label' => false,
                'required' => false,
                'allow_delete' => true,
                'download_label' => true,
                'download_uri' => $getCachedPicture,
                'image_uri' => $getCachedPicture,
                'asset_helper' => true,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => MediaImage::class,
            'uri_filter' => 'thumbnail_preview',
            'help' => 'media_image.help',
        ]);
    }
}
