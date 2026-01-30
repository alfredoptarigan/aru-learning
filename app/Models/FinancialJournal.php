<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class FinancialJournal extends Model
{
    use HasUuid;

    protected $fillable = [
        'user_id',
        'order_id',
        'type',
        'amount',
        'status',
        'description',
        'metadata'
    ];

    protected $casts = [
        'metadata' => 'array'
    ];
}
