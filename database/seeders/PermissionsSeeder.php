<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\PermissionGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define permission groups with their permissions
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
            $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            $this->command->info('🔑 Creating Permission Groups & Permissions');
            $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            $totalPermissions = 0;

            // Create permission groups and their permissions
            foreach ($permissionGroups as $groupName => $permissions) {
                // Create or get permission group with explicit UUID
                $group = PermissionGroup::where('name', $groupName)->first();
                if (!$group) {
                    $group = PermissionGroup::create([
                        'id' => (string) Str::uuid(),
                        'name' => $groupName,
                    ]);
                }

                $this->command->info("\n📁 {$groupName}:");

                // Create permissions for this group
                foreach ($permissions as $permissionName) {
                    $permission = Permission::where('name', $permissionName)->first();
                    if (!$permission) {
                        $permission = Permission::create([
                            'id' => (string) Str::uuid(),
                            'name' => $permissionName,
                            'permission_group_id' => $group->id,
                            'guard_name' => 'web',
                        ]);
                    } else {
                        // Update permission_group_id if it was created with different group
                        if ($permission->permission_group_id !== $group->id) {
                            $permission->update(['permission_group_id' => $group->id]);
                        }
                    }

                    $this->command->info("  ✓ {$permissionName}");
                    $totalPermissions++;
                }
            }

            DB::commit();

            $this->command->info("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            $this->command->info('✓ Permission groups and permissions created!');
            $this->command->info("✓ Total: {$totalPermissions} permissions in ".count($permissionGroups).' groups');
            $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('✗ Failed to create permissions: '.$e->getMessage());
            throw $e;
        }
    }
}
