<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Series extends Model
{
    protected $guarded = ['id'];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($series) {
            $series->uuid  = generateUniqueUuid(self::class);
            $series->slug = generateUniqueSlug(self::class, $series->title);
        });
    }


    public function movie(): BelongsTo
    {
        return $this->belongsTo(Movie::class);
    }

    public function episodes(): HasMany
    {
        return $this->hasMany(Episode::class);
    }
}
