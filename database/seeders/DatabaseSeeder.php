<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info("\n");
        $this->command->info('╔══════════════════════════════════════════════╗');
        $this->command->info('║   🌱 ARU LEARNING - DATABASE SEEDING 🌱    ║');
        $this->command->info('╚══════════════════════════════════════════════╝');
        $this->command->info("\n");

        // Run seeders in proper order
        $this->call([
            PermissionsSeeder::class,    // Step 1: Create permission groups & permissions
            RolesSeeder::class,          // Step 2: Create roles & assign permissions
            AdminUserSeeder::class,      // Step 3: Create admin user with admin role
        ]);

        $this->command->info("\n");
        $this->command->info('╔══════════════════════════════════════════════╗');
        $this->command->info('║        ✅ SEEDING COMPLETED SUCCESSFULLY!    ║');
        $this->command->info('╚══════════════════════════════════════════════╝');
        $this->command->info("\n");
    }
}
