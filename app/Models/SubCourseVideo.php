<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class SubCourseVideo extends Model
{
    use HasUuid;
    
    protected $table = "subcourse_videos";
    protected $primaryKey = "id";
    public $timestamps = true;
    protected $fillable = [
        "sub_course_id",
        "title",
        "video_url",
        "is_locked",
        "duration"
    ];

    protected $casts = [
        'is_locked' => 'boolean',
        'duration' => 'integer'
    ];

    public function subCourse()
    {
        return $this->belongsTo(SubCourse::class, "sub_course_id");
    }
}
