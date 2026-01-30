<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $adminEmail = 'alfredoptarigan@tech.com';
            $adminName = 'Alfredo Patricius Tarigan';
            $adminPassword = 'Carthy1234';

            // Check if admin user exists
            $admin = User::where('email', $adminEmail)->first();

            if ($admin) {
                // Update existing admin user
                $admin->update([
                    'name' => $adminName,
                    'password' => Hash::make($adminPassword),
                    'email_verified_at' => $admin->email_verified_at ?? now(),
                ]);

                $this->command->info('✓ Admin user already exists, updated credentials');
            } else {
                // Create new admin user with explicit UUID
                $admin = User::create([
                    'id' => (string) Str::uuid(),
                    'name' => $adminName,
                    'email' => $adminEmail,
                    'password' => Hash::make($adminPassword),
                    'email_verified_at' => now(),
                ]);

                $this->command->info('✓ Admin user created successfully');
            }

            // Ensure admin role is assigned
            $adminRole = Role::where('name', 'admin')->first();

            if ($adminRole) {
                // Sync admin role (remove others, add admin)
                $admin->roles()->sync([$adminRole->id]);
                $this->command->info('✓ Admin role assigned to user');
            } else {
                $this->command->warn('⚠ Admin role not found. Please run RolesSeeder first.');
            }

            DB::commit();

            $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            $this->command->info('🎉 Admin User Setup Complete!');
            $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            $this->command->info("📧 Email: {$adminEmail}");
            $this->command->info("🔑 Password: {$adminPassword}");
            $this->command->warn('⚠️  IMPORTANT: Change password after first login!');
            $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('✗ Failed to create admin user: '.$e->getMessage());
            throw $e;
        }
    }
}
