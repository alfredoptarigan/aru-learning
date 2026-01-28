<?php

namespace App\Services\PermissionGroup;

use App\Interfaces\PermissionGroup\PermissionGroupRepositoryInterface;

class PermissionGroupService
{
    protected $permissionGroupRepository;

    public function __construct(PermissionGroupRepositoryInterface $permissionGroupRepository)
    {
        $this->permissionGroupRepository = $permissionGroupRepository;
    }

    public function getAllGroups()
    {
        return $this->permissionGroupRepository->getAll();
    }

    public function createGroup(array $data)
    {
        return $this->permissionGroupRepository->create($data);
    }

    public function deleteGroup(string $id)
    {
        return $this->permissionGroupRepository->delete($id);
    }
}
