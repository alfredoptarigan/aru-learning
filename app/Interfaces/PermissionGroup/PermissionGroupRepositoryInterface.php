<?php

namespace App\Interfaces\PermissionGroup;

interface PermissionGroupRepositoryInterface
{
    public function getAll();
    public function create(array $data);
    public function delete(string $id);
}
