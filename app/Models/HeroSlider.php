<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HeroSlider extends Model
{
    public $guarded = ["id"];

    public function movie() : BelongsTo
    {
        return $this->belongsTo(Movie::class);
    }
}
