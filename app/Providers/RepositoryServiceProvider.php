<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Interfaces\Tier\TierRepositoryInterface::class,
            \App\Repositories\Tier\TierRepository::class
        );

        $this->app->bind(
            \App\Interfaces\User\UserRepositoryInterface::class,
            \App\Repositories\User\UserRepository::class
        );

        $this->app->bind(
            \App\Interfaces\Role\RoleRepositoryInterface::class,
            \App\Repositories\Role\RoleRepository::class
        );

        $this->app->bind(
            \App\Interfaces\Permission\PermissionRepositoryInterface::class,
            \App\Repositories\Permission\PermissionRepository::class
        );

        $this->app->bind(
            \App\Interfaces\PermissionGroup\PermissionGroupRepositoryInterface::class,
            \App\Repositories\PermissionGroup\PermissionGroupRepository::class
        );

        $this->app->bind(
            \App\Interfaces\Course\CourseRepositoryInterface::class,
            \App\Repositories\Course\CourseRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
