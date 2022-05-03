<?php

namespace App\DataFixtures;

use App\Entity\Role;
use App\Entity\Scope;
use App\Entity\Structure;
use App\Entity\User;
use App\Enum\Gender;
use App\Enum\StaticRole;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixture extends Fixture
{
    public const DEFAULT_PASSWORD = 'password';

    public function __construct(private string $projectDir, private UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $faker = \Faker\Factory::create('fr_FR');
        $file = fopen(sprintf('%s/resources/fixtures/users-fixture.csv', $this->projectDir), 'r');
        $index = 0;

        $admin = (new User())
            ->setUuid('admin')
            ->setEmail('admin@modulo.com')
            ->setPlainPassword('root')
            ->setFirstName('Admin')
            ->setLastName('Modulo')
            ->setGender(Gender::random())
            ->setRoles([StaticRole::ROLE_USER->name, StaticRole::ROLE_SUPER_ADMIN->name])
        ;
        $manager->persist($admin);

        while ($row = fgetcsv($file, 1000)) {
            ++$index;
            if (1 === $index) {
                continue;
            }

            [$code, $structureCode, $role, $structureCode2, $role2] = $row;
            $gender = Gender::random();
            $firstName = $faker->firstName;
            $lastName = $faker->lastName;
            $email = strtolower(sprintf('%s.%s_%s@%s', $firstName, $lastName, $index, $faker->unique(true)->safeEmailDomain));

            $user = (new User())
                ->setUuid($code)
                ->setEmail($email)
                ->setPlainPassword(self::DEFAULT_PASSWORD)
                ->setFirstName($firstName)
                ->setLastName($lastName)
                ->setGender($gender)
                ->setRoles([StaticRole::ROLE_USER->name])
            ;
            $manager->persist($user);

            $structure = $this->getReference(sprintf('structure-%s', $structureCode));
            if (!$structure instanceof Structure) {
                throw new \LogicException();
            }

            $role = $this->getReference(sprintf('role-%s', $role));
            if (!$role instanceof Role) {
                throw new \LogicException();
            }

            $scope = (new Scope())
                ->setUser($user)
                ->setStructure($structure)
                ->setRole($role)
            ;
            $manager->persist($scope);

            if (!empty($structureCode2)) {
                $structure2 = $this->getReference(sprintf('structure-%s', $structureCode));
                if (!$structure2 instanceof Structure) {
                    throw new \LogicException();
                }

                $role2 = $this->getReference(sprintf('role-%s', $role2));
                if (!$role2 instanceof Role) {
                    throw new \LogicException();
                }

                $scope = (new Scope())
                    ->setUser($user)
                    ->setStructure($structure2)
                    ->setRole($role2)
                ;
                $manager->persist($scope);
            }
        }

        $manager->flush();
    }
}
