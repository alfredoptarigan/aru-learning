<?php

namespace App\Interfaces\Permission;

interface PermissionRepositoryInterface
{
    public function getAll();
    public function create(array $data);
    public function delete(string $id);
}
