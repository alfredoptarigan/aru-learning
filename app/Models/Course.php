<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasUuid;

    protected $table = "courses";
    protected $primaryKey = "id";
    public $timestamps = true;
    protected $fillable = [
        "title",
        "description",
        "price",
        "is_premium",
        "is_published"
    ];

    public function courseImages()
    {
        return $this->hasMany(CourseImage::class, "course_id");
    }

    public function courseMentors()
    {
        return $this->hasMany(CourseMentor::class, "course_id");
    }
}
