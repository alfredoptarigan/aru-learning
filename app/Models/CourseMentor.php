<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class CourseMentor extends Model
{
    use HasUuid;

    protected $table = "course_mentors";
    protected $primaryKey = "id";
    public $timestamps = true;
    protected $fillable = [
        "course_id",
        "mentor_id"
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, "course_id");
    }

    public function user()
    {
        return $this->belongsTo(User::class, "mentor_id");
    }

}
