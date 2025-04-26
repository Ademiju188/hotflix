<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\RolesEnum;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;


    protected $guarded = ['id'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (User $user) {
            $user->uuid  = generateUniqueUuid(self::class);
        });
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function initials(): string
    {
        return Str::of($this->name)
            ->explode(' ')
            ->map(fn (string $name) => Str::of($name)->substr(0, 1))
            ->implode('');
    }

    public function dashboard()
    {
        // dd($this->role_id);
        return match((int) $this->role_id) {
            1 => route('system.dashboard'),
            2 => route('system.dashboard'),
            3 => route('user.dashboard'),
        };
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function isSuperAdmin()
    {
        return user()->role->slug === 'superadmin';
    }

    public function isAdmin()
    {
        return user()->role->slug === 'admin';
    }

    public function isViewer()
    {
        return user()->role->slug === 'viewer';
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function watchHistory(): MorphMany
    {
        return $this->morphMany(WatchHistory::class, 'watchable');
    }

    // public function freeContentTracking(): HasMany
    // {
    //     return $this->hasMany(FreeContentTracking::class);
    // }

    public function hasActiveSubscription(): bool
    {
        return $this->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>', now())
            ->exists();
    }
}
