<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'name',
        'permission_group_id',
        'guard_name',
    ];

    public function group()
    {
        return $this->belongsTo(PermissionGroup::class, 'permission_group_id');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_has_permissions');
    }
}
