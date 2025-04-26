<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    protected $guarded = ['id'];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (Category $category) {
            $category->uuid  = generateUniqueUuid(self::class);
            $category->slug = generateUniqueSlug(self::class, $category->name);
        });
    }

    public function movies(): BelongsToMany
    {
        return $this->belongsToMany(Movie::class, 'category_movie');
    }

    public function scopeIsActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }
}
