<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'trx_ref'   =>  $this->trx_ref,
            'plan'      => (new PlanResource($this->plan)),
            'amount'    =>  $this->amount,
            'currency'  =>  $this->currency,
            'status'    =>  $this->status,
            'created_at'   =>   $this->created_at->format('d M Y')
        ];
    }
}
