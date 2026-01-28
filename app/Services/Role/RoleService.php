<?php

namespace App\Services\Role;

use App\Interfaces\Role\RoleRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Exception;

class RoleService
{
    protected $roleRepository;

    public function __construct(RoleRepositoryInterface $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    public function getAllRoles()
    {
        return $this->roleRepository->getAll();
    }

    public function createRole(array $data)
    {
        return DB::transaction(function () use ($data) {
            $role = $this->roleRepository->create([
                'name' => $data['name'],
                'guard_name' => 'web',
            ]);

            if (isset($data['permissions'])) {
                $this->roleRepository->syncPermissions($role, $data['permissions']);
            }

            return $role;
        });
    }

    public function updateRole(string $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $role = $this->roleRepository->update($id, [
                'name' => $data['name'],
            ]);

            if (isset($data['permissions'])) {
                $this->roleRepository->syncPermissions($role, $data['permissions']);
            }

            return $role;
        });
    }

    public function deleteRole(string $id)
    {
        return DB::transaction(function () use ($id) {
            return $this->roleRepository->delete($id);
        });
    }
}
