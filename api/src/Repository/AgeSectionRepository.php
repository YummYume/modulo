<?php

namespace App\Repository;

use App\Entity\AgeSection;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method AgeSection|null find($id, $lockMode = null, $lockVersion = null)
 * @method AgeSection|null findOneBy(array $criteria, array $orderBy = null)
 * @method AgeSection[]    findAll()
 * @method AgeSection[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
final class AgeSectionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AgeSection::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(AgeSection $entity, bool $flush = true): void
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
    public function remove(AgeSection $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }
}
