<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\PermissionGroup;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define permission groups with their permissions based on Sidebar.tsx
        $permissionGroups = [
            'Course Management' => [
                'course.index',
                'course.create',
                'course.edit',
                'course.delete',
                'promo.index',
                'promo.create',
                'promo.edit',
                'promo.delete',
                'coding-tool.index',
                'coding-tool.create',
                'coding-tool.edit',
                'coding-tool.delete',
            ],
            'Access Control' => [
                'role.index',
                'role.create',
                'role.edit',
                'role.delete',
                'permission.index',
                'permission.create',
                'permission.edit',
                'permission.delete',
                'permission-group.index',
                'permission-group.create',
                'permission-group.edit',
                'permission-group.delete',
            ],
        ];

        DB::beginTransaction();

        try {
            $allPermissions = [];

            // Migrate old "Course" group permissions to "Course Management"
            $oldCourseGroup = PermissionGroup::where('name', 'Course')->first();
            if ($oldCourseGroup) {
                // Get the Course Management group
                $courseManagementGroup = PermissionGroup::firstOrCreate(
                    ['name' => 'Course Management']
                );

                // Move all permissions from old group to new group
                Permission::where('permission_group_id', $oldCourseGroup->id)
                    ->update(['permission_group_id' => $courseManagementGroup->id]);

                // Delete old group
                $oldCourseGroup->delete();

                $this->command->info('✓ Migrated old "Course" group to "Course Management"');
            }

            // Create permission groups and their permissions
            foreach ($permissionGroups as $groupName => $permissions) {
                // Create or get permission group
                $group = PermissionGroup::firstOrCreate(
                    ['name' => $groupName]
                );

                // Create permissions for this group
                foreach ($permissions as $permissionName) {
                    $permission = Permission::firstOrCreate(
                        ['name' => $permissionName],
                        [
                            'permission_group_id' => $group->id,
                            'guard_name' => 'web',
                        ]
                    );

                    // Update permission_group_id if it was created with different group
                    if ($permission->permission_group_id !== $group->id) {
                        $permission->update(['permission_group_id' => $group->id]);
                    }

                    $allPermissions[] = $permission->id;
                }
            }

            // Get admin role
            $adminRole = Role::where('name', 'admin')->first();

            if ($adminRole) {
                // Sync all permissions to admin role
                $adminRole->permissions()->syncWithoutDetaching($allPermissions);

                $this->command->info('✓ Admin role has been assigned all permissions');
            } else {
                $this->command->warn('⚠ Admin role not found. Please create an admin role first.');
            }

            DB::commit();

            $this->command->info('✓ Permission groups and permissions created successfully!');
            $this->command->info('✓ Total permissions created: '.count($allPermissions));
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('✗ Failed to create permissions: '.$e->getMessage());
            throw $e;
        }
    }
}
