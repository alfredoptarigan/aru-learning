<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Tier extends Model
{
    use HasUuids;

    protected $table = "tiers";
    protected $primaryKey = "id";
    public $timestamps = true;
    protected $fillable = [
        "name",
    ];

    public function users()
    {
        return $this->belongsTo(User::class, "tier_id");
    }
}
