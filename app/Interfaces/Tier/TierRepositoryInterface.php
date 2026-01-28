<?php

namespace App\Interfaces\Tier;

interface TierRepositoryInterface
{
    public function create(array $data);
    public function findByName(string $name);
    public function getPaginated(int $perPage = 10);
}
