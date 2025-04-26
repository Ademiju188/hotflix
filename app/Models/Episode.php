<?php

namespace App\Models;

use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Episode extends Model
{
    protected $guarded = ['id'];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (Episode $episode) {
            $episode->uuid  = generateUniqueUuid(self::class);
            $episode->slug = generateUniqueSlug(self::class, $episode->title);
        });
    }

    // public function series(): BelongsTo
    // {
    //     return $this->belongsTo(Series::class);
    // }

    // Helper to get parent movie
    public function movie(): BelongsTo
    {
        return $this->belongsTo(Movie::class);
    }

    public function video()
    {
        $path = ltrim($this->video_path, '/');

        if ($path && File::exists(storage_path("app/public/{$path}"))) {
            return asset("storage/{$path}");
        }

        // return asset('images/default-banner.jpg');
    }

    public function watchHistory(): MorphMany
    {
        return $this->morphMany(WatchHistory::class, 'watchable');
    }

    public function encryptionKey(): MorphOne
    {
        return $this->morphOne(VideoEncryptionKey::class, 'videoable');
    }

    // public function featured()
    // {
    //     return $this->morphOne(FeaturedContent::class, 'featurable');
    // }
}
