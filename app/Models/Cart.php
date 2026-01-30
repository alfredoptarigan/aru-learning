<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasUuid;

    protected $fillable = ['user_id', 'session_id'];

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }
}
