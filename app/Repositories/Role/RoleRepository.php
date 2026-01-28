<?php

namespace App\Repositories\Role;

use App\Interfaces\Role\RoleRepositoryInterface;
use App\Models\Role;

class RoleRepository implements RoleRepositoryInterface
{
    public function getAll()
    {
        return Role::with('permissions')->get();
    }

    public function findByName(string $name)
    {
        return Role::where('name', $name)->first();
    }

    public function create(array $data)
    {
        return Role::create($data);
    }

    public function update(string $id, array $data)
    {
        $role = Role::findOrFail($id);
        $role->update($data);
        return $role;
    }

    public function delete(string $id)
    {
        $role = Role::findOrFail($id);
        return $role->delete();
    }

    public function syncPermissions($role, array $permissionIds)
    {
        $role->permissions()->sync($permissionIds);
        return $role->load('permissions');
    }
}
