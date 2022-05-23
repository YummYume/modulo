<?php

namespace App\Controller;

use App\Entity\MediaImage;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
final class CreateMediaImageAction extends AbstractController
{
    public function __invoke(Request $request): MediaImage
    {
        $uploadedImage = $request->files->get('image');
        if (!$uploadedImage) {
            throw new BadRequestHttpException('Parameter "image" is required.');
        }

        $media = (new MediaImage())
            ->setImage($uploadedImage)
        ;

        return $media;
    }
}
