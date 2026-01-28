<?php

namespace App\Http\Controllers;

use App\Services\PermissionGroup\PermissionGroupService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionGroupController extends Controller
{
    protected $permissionGroupService;

    public function __construct(PermissionGroupService $permissionGroupService)
    {
        $this->permissionGroupService = $permissionGroupService;
    }

    public function index()
    {
        return Inertia::render('PermissionGroup/Index', [
            'groups' => $this->permissionGroupService->getAllGroups(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permission_groups,name',
        ]);

        $this->permissionGroupService->createGroup($request->only('name'));

        return redirect()->route('permission-group.index')->with('success', 'Group created successfully.');
    }

    public function destroy(string $id)
    {
        $this->permissionGroupService->deleteGroup($id);
        return redirect()->route('permission-group.index')->with('success', 'Group deleted successfully.');
    }
}
