<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Traits\HasUuid;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUuid;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        // 'role', // Deprecated: Moved to roles table
        'profile_url',
        'phone_number',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the roles associated with the user.
     */
    public function roles()
    {
        return $this->morphToMany(Role::class, 'model', 'model_has_roles');
    }

    /**
     * Assign a role to the user.
     *
     * @param string $roleName
     * @return void
     */
    public function assignRole(string $roleName)
    {
        $role = Role::where('name', $roleName)->first();
        if ($role) {
            $this->roles()->syncWithoutDetaching([$role->id]);
        }
    }

    /**
     * Check if the user has a specific role.
     *
     * @param string $roleName
     * @return bool
     */
    public function hasRole(string $roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Get all permissions for the user via roles.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getAllPermissions()
    {
        return $this->roles->flatMap(function ($role) {
            return $role->permissions;
        })->unique('name');
    }

    /**
     * Check if the user has a specific permission.
     *
     * @param string $permission
     * @return bool
     */
    public function hasPermissionTo(string $permission)
    {
        return $this->getAllPermissions()->contains('name', $permission);
    }

    /**
     * Get the role names as a list.
     */
    public function getRoleNames()
    {
        return $this->roles->pluck('name');
    }

    public function tier()
    {
        return $this->hasOne(Tier::class, "id", "tier_id");
    }

    public function courseMentors()
    {
        return $this->hasMany(CourseMentor::class, "mentor_id");
    }

}
