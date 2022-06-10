<?php

namespace App\Repository;

use App\Entity\Event;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Event|null find($id, $lockMode = null, $lockVersion = null)
 * @method Event|null findOneBy(array $criteria, array $orderBy = null)
 * @method Event[]    findAll()
 * @method Event[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
final class EventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Event::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(Event $entity, bool $flush = true): void
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
    public function remove(Event $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    public function findByCountAndDate(
        \DateTimeImmutable|\DateTime $since,
        \DateTimeImmutable|\DateTime $to = new \DateTimeImmutable('today 23:59:59')
    ): array {
        return $this->createQueryBuilder('e')
            ->select('COUNT(e) as y, DATE_FORMAT(e.createdAt, \'%Y-%m-%d\') as x')
            ->where('e.createdAt BETWEEN :since AND :to')
            ->setParameters([
                'since' => $since,
                'to' => $to,
            ])
            ->groupBy('x')
            ->orderBy('x', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findEventCountByActiveAndInactive(): array
    {
        $events = $this->createQueryBuilder('e')
            ->select('SUM(CASE WHEN e.active = 1 THEN 1 ELSE 0 END) as active, SUM(CASE WHEN e.active = 0 THEN 1 ELSE 0 END) as inactive')
            ->getQuery()
            ->getSingleResult()
        ;

        return [
            'active' => $events['active'] ?? 0,
            'inactive' => $events['inactive'] ?? 0,
        ];
    }
}
