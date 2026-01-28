<?php

namespace App\Interfaces\Tier;

interface TierRepositoryInterface
{
    public function create(array $data);
    public function findByName(string $name);
    public function getPaginated(int $perPage = 10);
    public function update(string $id, array $data);
    public function delete(string $id);
    public function findById(string $id);
}
