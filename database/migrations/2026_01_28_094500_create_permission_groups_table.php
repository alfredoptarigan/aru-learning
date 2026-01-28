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
        // 1. Create permission_groups table
        Schema::create('permission_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // 2. Add foreign key column to permissions
        Schema::table('permissions', function (Blueprint $table) {
            $table->foreignUuid('permission_group_id')->nullable()->after('id')->constrained('permission_groups')->onDelete('set null');
        });

        // 3. Migrate Data
        $permissions = DB::table('permissions')->get();
        $existingGroups = [];

        foreach ($permissions as $permission) {
            if (!empty($permission->group_name)) {
                $groupName = $permission->group_name;
                
                // Create group if not exists
                if (!isset($existingGroups[$groupName])) {
                    $groupId = Str::uuid()->toString();
                    DB::table('permission_groups')->insert([
                        'id' => $groupId,
                        'name' => $groupName,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $existingGroups[$groupName] = $groupId;
                }

                // Update permission
                DB::table('permissions')
                    ->where('id', $permission->id)
                    ->update(['permission_group_id' => $existingGroups[$groupName]]);
            }
        }

        // 4. Drop old column
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropColumn('group_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->string('group_name')->nullable();
        });

        // Restore data (best effort)
        $permissions = DB::table('permissions')->get();
        foreach ($permissions as $permission) {
            if ($permission->permission_group_id) {
                $group = DB::table('permission_groups')->where('id', $permission->permission_group_id)->first();
                if ($group) {
                    DB::table('permissions')
                        ->where('id', $permission->id)
                        ->update(['group_name' => $group->name]);
                }
            }
        }

        Schema::table('permissions', function (Blueprint $table) {
            $table->dropForeign(['permission_group_id']);
            $table->dropColumn('permission_group_id');
        });

        Schema::dropIfExists('permission_groups');
    }
};
