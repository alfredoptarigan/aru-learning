<?php

namespace App\Interfaces\CodingTool;

use App\Models\CodingTool;

interface CodingToolRepositoryInterface
{
    public function create(array $data): CodingTool;
    public function update(string $id, array $data): CodingTool;
    public function getAll(int $perPage = 10);
}
