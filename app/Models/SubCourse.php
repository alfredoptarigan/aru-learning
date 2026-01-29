<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class SubCourse extends Model
{
    use HasUuid;
    
    protected $table = "sub_courses";
    protected $primaryKey = "id";
    public $timestamps = true;
    protected $fillable = [
        "course_id",
        "title",
        "description"
    ];

    public function subCourseVideos()
    {
        return $this->hasMany(SubCourseVideo::class, "sub_course_id");
    }

    public function course()
    {
        return $this->belongsTo(Course::class, "course_id");
    }
}
