<?php

namespace App\Repositories\Permission;

use App\Interfaces\Permission\PermissionRepositoryInterface;
use App\Models\Permission;

class PermissionRepository implements PermissionRepositoryInterface
{
    public function getAll()
    {
        return Permission::with('group')->get();
    }

    public function create(array $data)
    {
        return Permission::create($data);
    }

    public function delete(string $id)
    {
        $permission = Permission::findOrFail($id);
        return $permission->delete();
    }
}
