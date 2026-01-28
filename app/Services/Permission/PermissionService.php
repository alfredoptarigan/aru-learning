<?php

namespace App\Services\Permission;

use App\Interfaces\Permission\PermissionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class PermissionService
{
    protected $permissionRepository;

    public function __construct(PermissionRepositoryInterface $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;
    }

    public function getAllPermissions()
    {
        return $this->permissionRepository->getAll();
    }

    public function createPermission(array $data)
    {
        return $this->permissionRepository->create([
            'name' => $data['name'],
            'permission_group_id' => $data['permission_group_id'],
            'guard_name' => 'web',
        ]);
    }

    public function deletePermission(string $id)
    {
        return $this->permissionRepository->delete($id);
    }
}
