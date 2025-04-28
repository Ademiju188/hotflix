<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Plan extends Model
{
    protected $guarded = ['id'];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function($model) {
            $model->uuid = generateUniqueUuid(self::class);
            $model->slug = generateUniqueSlug(self::class, $model->name);
        });
    }

    public function planType(): BelongsTo
    {
        return $this->belongsTo(PlanType::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}
