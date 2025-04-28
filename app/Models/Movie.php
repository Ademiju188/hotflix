<?php

namespace App\Models;

use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Movie extends Model
{
    protected $guarded = ['id'];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (Movie $movie) {
            $movie->uuid  = generateUniqueUuid(self::class);
            $movie->slug = generateUniqueSlug(self::class, $movie->title);
        });
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_movie');
    }

    public function series(): HasMany
    {
        return $this->hasMany(Series::class);
    }

    public function episodes(): HasMany
    {
        return $this->hasMany(Episode::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function encryptionKey(): MorphOne
    {
        return $this->morphOne(VideoEncryptionKey::class, 'videoable');
    }

    public function watchHistory(): MorphMany
    {
        return $this->morphMany(WatchHistory::class, 'watchable');
    }

    // public function featured()
    // {
    //     return $this->morphOne(FeaturedContent::class, 'featurable');
    // }

    public function isSingle(): bool
    {
        return $this->content_type === 'single';
    }

    public function hasSeries(): bool
    {
        return $this->content_type === 'series';
    }

    public function banner(): string
    {
        $path = ltrim($this->banner_path, '/');

        if ($path && File::exists(storage_path("app/public/{$path}"))) {
            return asset("storage/{$path}");
        }

        return asset('images/default-banner.jpg');
    }

    public function scopeIsActive($query)
    {
        return $query->where('active', true);
    }

}
