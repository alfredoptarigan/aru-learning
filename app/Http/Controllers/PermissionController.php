<?php

namespace App\Http\Controllers;

use App\Services\Permission\PermissionService;
use App\Services\PermissionGroup\PermissionGroupService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    protected $permissionService;
    protected $permissionGroupService;

    public function __construct(PermissionService $permissionService, PermissionGroupService $permissionGroupService)
    {
        $this->permissionService = $permissionService;
        $this->permissionGroupService = $permissionGroupService;
    }

    public function index()
    {
        return Inertia::render('Permission/Index', [
            'permissions' => $this->permissionService->getAllPermissions(),
            'groups' => $this->permissionGroupService->getAllGroups(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
            'permission_group_id' => 'required|exists:permission_groups,id',
        ]);

        $this->permissionService->createPermission($request->only('name', 'permission_group_id'));

        return redirect()->route('permission.index')->with('success', 'Permission created successfully.');
    }

    public function destroy(string $id)
    {
        $this->permissionService->deletePermission($id);
        return redirect()->route('permission.index')->with('success', 'Permission deleted successfully.');
    }
}
