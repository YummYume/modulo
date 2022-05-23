<?php

namespace App\Controller;

use App\Entity\MediaFile;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
final class CreateMediaFileAction extends AbstractController
{
    public function __invoke(Request $request): MediaFile
    {
        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile) {
            throw new BadRequestHttpException('Parameter "file" is required.');
        }

        $media = (new MediaFile())
            ->setFile($uploadedFile)
        ;

        return $media;
    }
}
