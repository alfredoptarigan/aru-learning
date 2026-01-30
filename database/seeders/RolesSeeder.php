<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            // Define roles with their permissions
            $rolesConfig = [
                'admin' => [
                    'description' => 'Full system access with all permissions',
                    'permissions' => 'all', // Special case: all permissions
                ],
                'mentor' => [
                    'description' => 'Course instructor with course management access',
                    'permissions' => [
                        'course.index',
                        'course.create',
                        'course.edit',
                        'course.delete',
                    ],
                ],
                'user' => [
                    'description' => 'Regular learner with basic access',
                    'permissions' => [], // No special permissions
                ],
            ];

            $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            $this->command->info('🔐 Creating/Updating Roles & Permissions');
            $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            foreach ($rolesConfig as $roleName => $config) {
                // Create or update role
                $role = Role::firstOrCreate(
                    ['name' => $roleName],
                    ['description' => $config['description'] ?? null]
                );

                // Get permissions for this role
                if ($config['permissions'] === 'all') {
                    // Admin gets all permissions
                    $permissionIds = Permission::pluck('id')->toArray();
                    $permissionCount = count($permissionIds);
                } else {
                    // Get specific permissions
                    $permissions = Permission::whereIn('name', $config['permissions'])->get();
                    $permissionIds = $permissions->pluck('id')->toArray();
                    $permissionCount = count($permissionIds);

                    // Warn if some permissions are missing
                    if ($permissionCount < count($config['permissions'])) {
                        $missing = array_diff($config['permissions'], $permissions->pluck('name')->toArray());
                        $this->command->warn("  ⚠ Role '{$roleName}' - Missing permissions: ".implode(', ', $missing));
                    }
                }

                // Sync permissions (this will replace existing permissions)
                $role->permissions()->sync($permissionIds);

                // Output result
                $icon = match ($roleName) {
                    'admin' => '👑',
                    'mentor' => '👨‍🏫',
                    'user' => '👤',
                    default => '🔹',
                };

                $this->command->info("  {$icon} {$roleName}: {$permissionCount} permissions assigned");
            }

            DB::commit();

            $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            $this->command->info('✓ Roles created/updated successfully!');
            $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('✗ Failed to create roles: '.$e->getMessage());
            throw $e;
        }
    }
}
