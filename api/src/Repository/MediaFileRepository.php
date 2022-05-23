<?php

namespace App\Repository;

use App\Entity\MediaFile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method MediaFile|null find($id, $lockMode = null, $lockVersion = null)
 * @method MediaFile|null findOneBy(array $criteria, array $orderBy = null)
 * @method MediaFile[]    findAll()
 * @method MediaFile[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
final class MediaFileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MediaFile::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(MediaFile $entity, bool $flush = true): void
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
    public function remove(MediaFile $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }
}
