<?php

namespace App\Repositories\User;

use App\Interfaces\User\UserRepositoryInterface;
use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function all(int $perPage = 10)
    {
        return User::with('tier')->latest()->paginate($perPage);
    }

    public function assignRole(string $userid, string $role)
    {
        $user = User::findOrFail($userid);
        $user->assignRole($role);

        return $user;
    }
}
