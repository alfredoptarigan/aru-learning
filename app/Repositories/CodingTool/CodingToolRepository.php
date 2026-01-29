<?php

namespace App\Repositories\CodingTool;

use App\Interfaces\CodingTool\CodingToolRepositoryInterface;
use App\Models\CodingTool;

class CodingToolRepository implements CodingToolRepositoryInterface
{
    public function create(array $data): CodingTool
    {
        return CodingTool::create($data);
    }

    public function update(string $id, array $data): CodingTool
    {
        $codingTool = CodingTool::findOrFail($id);
        $codingTool->update($data);
        return $codingTool;
    }

    public function delete(string $id): bool
    {
        $codingTool = CodingTool::findOrFail($id);
        return $codingTool->delete();
    }

    public function findById(string $id): CodingTool
    {
        return CodingTool::findOrFail($id);
    }

    public function getAll(int $perPage = 10)
    {
        return CodingTool::latest()->paginate($perPage);
    }
}
