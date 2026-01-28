<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PermissionGroup extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'name',
    ];

    public function permissions()
    {
        return $this->hasMany(Permission::class);
    }
}
