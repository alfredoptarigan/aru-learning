<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasUuid;

    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'discount_amount',
        'status',
        'payment_provider',
        'payment_id',
        'promo_id'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function promo()
    {
        return $this->belongsTo(Promo::class);
    }
}
