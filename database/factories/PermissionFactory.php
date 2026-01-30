<?php

namespace Database\Factories;

use App\Models\PermissionGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Permission>
 */
class PermissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $resource = fake()->randomElement(['post', 'comment', 'page', 'media', 'setting']);
        $action = fake()->randomElement(['index', 'create', 'edit', 'delete', 'view']);

        return [
            'name' => "{$resource}.{$action}",
            'guard_name' => 'web',
            'permission_group_id' => PermissionGroup::factory(),
        ];
    }
}
