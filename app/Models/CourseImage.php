<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseImage extends Model
{
    protected $table = "course_images";
    protected $primaryKey = "id";
    public $timestamps = true;
    protected $fillable = [
        "course_id",
        "image_url",
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, "course_id");
    }
}
