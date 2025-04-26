<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanType extends Model
{
    protected $guarded = ['id'];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function($model) {
            $model->uuid = generateUniqueUuid(self::class);
        });
    }

    public function plans(): HasMany
    {
        return $this->hasMany(Plan::class);
    }
}
