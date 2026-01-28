<?php

namespace App\Http\Controllers;

use App\Services\Role\RoleService;
use App\Services\Permission\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    protected $roleService;
    protected $permissionService;

    public function __construct(RoleService $roleService, PermissionService $permissionService)
    {
        $this->roleService = $roleService;
        $this->permissionService = $permissionService;
    }

    public function index()
    {
        return Inertia::render('Role/Index', [
            'roles' => $this->roleService->getAllRoles(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Role/Partials/CreateRole', [
            'permissions' => $this->permissionService->getAllPermissions(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $this->roleService->createRole($request->all());

        return redirect()->route('role.index')->with('success', 'Role created successfully.');
    }

    public function edit(string $id)
    {
        $role = \App\Models\Role::with('permissions')->findOrFail($id);
        
        return Inertia::render('Role/Partials/EditRole', [
            'role' => $role,
            'permissions' => $this->permissionService->getAllPermissions(),
            'rolePermissions' => $role->permissions->pluck('id'),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $this->roleService->updateRole($id, $request->all());

        return redirect()->route('role.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->roleService->deleteRole($id);
        return redirect()->route('role.index')->with('success', 'Role deleted successfully.');
    }
}
