<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class CodingTool extends Model
{
    use HasUuid;

    protected $table = 'coding_tools';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'url_download',
        'image',
    ];

    public function courseTools() {
        return $this->belongsToMany(Course::class, 'course_tools', 'coding_tool_id', 'course_id');
    }
}
