<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'course_id', 'price'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
