<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserVideoProgress extends Model
{
    protected $fillable = [
        'user_id',
        'sub_course_video_id',
        'is_completed',
        'completed_at'
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function video()
    {
        return $this->belongsTo(SubCourseVideo::class, 'sub_course_video_id');
    }
}
