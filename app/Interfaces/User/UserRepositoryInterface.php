<?php

namespace App\Interfaces\User;

interface UserRepositoryInterface
{
    public function all(int $perPage = 10);
    public function assignRole(string $userid, string $role);
}
