<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

if (!function_exists('user')) {
    function user() {
        return auth()->user();
    }
}

if (! function_exists('appLogo')) {
    function appLogo() {
        return asset('assets/img/logo.png?t=' . time());
    }
}

if (! function_exists('companyLogo')) {
    function companyLogo() {
        return asset('assets/img/logo.png?t=' . time());
    }
}

if (! function_exists('appSetting')) {
    function appSettings($key) {
        Cache::remember('appSettings', now()->addMinutes(60), function () {
            return App\Models\Settings::all()->pluck('value', 'key')->toArray();
        });

        $settings = new Illuminate\Support\Fluent(Cache::get('appSettings'));
		return $settings->$key ?? '';
    }
}

if (!function_exists('getStayDuration')) {
    /**
     * Calculate the duration between checkin and checkout dates.
     *
     * @param string $checkin The checkin date in 'Y-m-d' format.
     * @param string $checkout The checkout date in 'Y-m-d' format.
     * @return int The number of days between the checkin and checkout dates.
     */
    function getStayDuration($checkin, $checkout)
    {
        // Convert strings to Carbon instances
        $checkinDate = Carbon::parse($checkin);
        $checkoutDate = Carbon::parse($checkout);

        // Calculate the difference in days
        $duration = $checkinDate->diffInDays($checkoutDate);

        return $duration;
    }
}

if (!function_exists('calculateFinalAmount')) {
      /**
     * Calculate the final amount after applying duration and discount.
     *
     * @param float $baseAmount The base amount before any calculation.
     * @param int $duration The duration, e.g., number of days.
     * @param float $discount The discount percentage to apply.
     * @return float The final calculated amount.
     */
    function calculateFinalAmount($baseAmount, $discount)
    {
        // Ensure discount is not negative
        $validDiscount = max($discount, 0);

        // Calculate the discount amount
        $discountAmount = $baseAmount * ($validDiscount / 100);

        // Calculate the final amount after applying discount
        $finalAmount = $baseAmount - $discountAmount;

        return $finalAmount;
    }
}

if (!function_exists('generateUniqueUuid')) {
    function generateUniqueUuid($model, $column = 'uuid')
    {
        // Generate a uuid from the name
        $uuid = Str::uuid();
        // Check for uniqueness
        while ($model::where($column, $uuid)->exists()) {
            $uuid = Str::uuid();
        }
        return $uuid;
    }
}

if (!function_exists('generateUniqueSlug')) {
    function generateUniqueSlug($model, $name, $column = 'slug')
    {
        // Generate a slug from the name
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        // Check for uniqueness
        while ($model::where($column, $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }
}

if (!function_exists('calculateSubscriptionDates')) {
    /**
     * Calculate subscription start and end dates
     *
     * @param int|null $durationDays Null means lifetime subscription
     * @param string|null $startDate Custom start date (optional)
     * @return array
     */
    function calculateSubscriptionDates(?int $durationDays, ?string $startDate = null): array
    {
        $start = $startDate ? Carbon::parse($startDate) : Carbon::now();

        if ($durationDays === null) {
            // Lifetime subscription
            return [
                'start_date' => $start->toDateString(),
                'end_date' => null, // Null indicates lifetime access
                'is_lifetime' => true
            ];
        }

        return [
            'start_date' => $start->toDateString(),
            'end_date' => $start->copy()->addDays($durationDays)->toDateString(),
            'is_lifetime' => false
        ];
    }
}
