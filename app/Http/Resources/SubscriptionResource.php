<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'    =>  $this->id,
            'uuid'  =>  $this->uuid,
            'has_subscription' => true,
            'plan_name' => $this->plan->name,
            'payment'   =>  (new PaymentResource($this->payment)),
            'start_data'    =>  $this->start_date,
            'end_date'    =>  $this->end_date,
            'next_bill_date' => $this->end_date?->format('d/m/Y'),
            'amount' => $this->plan->amount,
            'currency' => $this->plan->currency,
            'payment_method' => $this->payment_method,
            'auto_renew' => $this->auto_renew,
            'status'    => $this->status,
            'created_at'   =>   $this->created_at->format('d M Y')
        ];
    }
}
