<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserCourse extends Pivot
{
    protected $table = 'user_courses';
    
    protected $fillable = [
        'user_id',
        'course_id',
        'price_paid',
        'purchased_at'
    ];

    public $timestamps = true;
}
