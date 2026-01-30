<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStat extends Model
{
    protected $fillable = [
        'user_id',
        'total_exp',
        'level',
        'skill_points'
    ];

    protected $casts = [
        'skill_points' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
