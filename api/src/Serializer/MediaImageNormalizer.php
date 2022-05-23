<?php

namespace App\Serializer;

use App\Entity\MediaImage;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Vich\UploaderBundle\Storage\StorageInterface;

final class MediaImageNormalizer implements ContextAwareNormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'MEDIA_IMAGE_NORMALIZER_ALREADY_CALLED';

    public function __construct(
        private StorageInterface $storage,
        private CacheManager $imagineCacheManager,
        private RequestStack $requestStack
    ) {
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::ALREADY_CALLED] = true;

        $filter = $this->requestStack->getCurrentRequest()->query->get('imagineFilter') ?? 'original';
        $url = $this->storage->resolveUri($object, 'image');
        $object->contentUrl = $this->imagineCacheManager->getBrowserPath($url, $filter);

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof MediaImage;
    }
}
