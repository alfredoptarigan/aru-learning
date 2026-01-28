<?php

namespace App\Http\Controllers;

use App\Services\User\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request) {
        $perPage = $request->query('perPage', 10);
        $users = $this->userService->getPaginatedUsers($perPage);


        return Inertia::render('User/UserManagement', compact('users'));
    }
}
