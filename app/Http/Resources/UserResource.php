<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id'     =>  $this->id,
            'country' => (new CountryResource($this->country)),
            'uuid'   =>  $this->uuid,
            'role'   => $this->role,
            'country_id'   => $this->country_id,
            'name'   =>  $this->name,
            'username'  =>  $this->username,
            'email'      =>  $this->email,
            'dashboard'     => $this->dashboard(),
            'subscription' => $this->getSubscriptionData(),
            'created_at'    =>  $this->created_at->format('d M Y'),
            'verified'  =>  $this->email_verified_at ? true : false
        ];
    }

    protected function getSubscriptionData(): array
    {
        $subscription = $this->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>', now())
            ->with(['plan', 'payment'])
            ->latest()
            ->first();

        if (!$subscription) {
            return [
                'has_subscription' => false,
                'message' => 'You don\'t have an active subscription',
                'cta' => [
                    'text' => 'Upgrade Now',
                    'route' => route('pricing'),
                ]
            ];
        }

        return [
            'has_subscription' => true,
            'plan_name' => $subscription->plan->name,
            'next_bill_date' => $subscription->end_date?->format('d/m/Y'),
            'amount' => $subscription->payment->amount,
            'currency' => $subscription->payment->currency,
            'payment_method' => $subscription->payment_method,
            'auto_renew' => $subscription->auto_renew,
            'status' => $subscription->status,
        ];
    }
}
