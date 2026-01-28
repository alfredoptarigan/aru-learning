<?php

namespace App\Interfaces\Role;

interface RoleRepositoryInterface
{
    public function getAll();
    public function findByName(string $name);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
    public function syncPermissions($role, array $permissionIds);
}
