<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create Roles Table
        Schema::create('roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique(); // admin, mentor, user
            $table->string('guard_name')->default('web');
            $table->timestamps();
        });

        // 2. Create Permissions Table
        Schema::create('permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique(); // course.create, etc.
            $table->string('guard_name')->default('web');
            $table->timestamps();
        });

        // 3. Create Model Has Roles Table (Pivot for Users <-> Roles)
        Schema::create('model_has_roles', function (Blueprint $table) {
            $table->foreignUuid('role_id')->constrained('roles')->onDelete('cascade');
            $table->string('model_type');
            $table->uuid('model_id');
            $table->index(['model_id', 'model_type']);
            $table->primary(['role_id', 'model_id', 'model_type']);
        });

        // 4. Create Role Has Permissions Table (Pivot for Roles <-> Permissions)
        Schema::create('role_has_permissions', function (Blueprint $table) {
            $table->foreignUuid('permission_id')->constrained('permissions')->onDelete('cascade');
            $table->foreignUuid('role_id')->constrained('roles')->onDelete('cascade');
            $table->primary(['permission_id', 'role_id']);
        });

        // 5. Seed Default Roles & Migrate Data
        $this->migrateUserData();

        // 6. Drop old role column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add role column back
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user');
        });

        // Restore data (Reverse migration logic - simplified)
        // Note: This is a best-effort reverse. Complex M:N to 1:1 is lossy.
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            $roleLink = DB::table('model_has_roles')
                ->where('model_type', 'App\Models\User')
                ->where('model_id', $user->id)
                ->first();
            
            if ($roleLink) {
                $role = DB::table('roles')->where('id', $roleLink->role_id)->first();
                if ($role) {
                    DB::table('users')->where('id', $user->id)->update(['role' => $role->name]);
                }
            }
        }

        Schema::dropIfExists('role_has_permissions');
        Schema::dropIfExists('model_has_roles');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }

    private function migrateUserData()
    {
        // Create default roles
        $roles = ['admin', 'mentor', 'user'];
        $roleIds = [];

        foreach ($roles as $roleName) {
            $id = Str::uuid()->toString();
            DB::table('roles')->insert([
                'id' => $id,
                'name' => $roleName,
                'guard_name' => 'web',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $roleIds[$roleName] = $id;
        }

        // Migrate existing users
        // Check if users table exists and has role column (safety check)
        if (Schema::hasColumn('users', 'role')) {
            $users = DB::table('users')->get();

            foreach ($users as $user) {
                $currentRole = $user->role ?? 'user'; // Default to user if null
                
                // Map old role string to new Role ID
                // Handle cases where old role might not match exactly (e.g. case sensitivity)
                $normalizedRole = strtolower($currentRole);
                if (!isset($roleIds[$normalizedRole])) {
                    // Fallback to 'user' or create new role? Let's fallback to 'user' for safety
                    $targetRoleId = $roleIds['user'];
                } else {
                    $targetRoleId = $roleIds[$normalizedRole];
                }

                DB::table('model_has_roles')->insert([
                    'role_id' => $targetRoleId,
                    'model_type' => 'App\Models\User',
                    'model_id' => $user->id,
                ]);
            }
        }
    }
};
