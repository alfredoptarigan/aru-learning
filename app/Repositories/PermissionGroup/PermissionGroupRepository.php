<?php

namespace App\Repositories\PermissionGroup;

use App\Interfaces\PermissionGroup\PermissionGroupRepositoryInterface;
use App\Models\PermissionGroup;

class PermissionGroupRepository implements PermissionGroupRepositoryInterface
{
    public function getAll()
    {
        return PermissionGroup::all();
    }

    public function create(array $data)
    {
        return PermissionGroup::create($data);
    }

    public function delete(string $id)
    {
        $group = PermissionGroup::findOrFail($id);
        return $group->delete();
    }
}
