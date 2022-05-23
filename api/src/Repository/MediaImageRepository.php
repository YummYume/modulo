<?php

namespace App\Repository;

use App\Entity\MediaImage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method MediaImage|null find($id, $lockMode = null, $lockVersion = null)
 * @method MediaImage|null findOneBy(array $criteria, array $orderBy = null)
 * @method MediaImage[]    findAll()
 * @method MediaImage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
final class MediaImageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MediaImage::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(MediaImage $entity, bool $flush = true): void
    {
        $this->_em->persist($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function remove(MediaImage $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }
}
