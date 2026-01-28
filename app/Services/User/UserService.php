<?php

namespace App\Services\User;

use App\Interfaces\User\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Exception;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getPaginatedUsers(int $perPage = 10)
    {
        return $this->userRepository->all($perPage);
    }
}
