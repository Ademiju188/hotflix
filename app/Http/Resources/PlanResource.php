<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
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
            'plan_type'  =>    (new PlanTypeResource($this->planType)),
            'description'   => $this->description,
            'hierarchy' =>  $this->hierarchy,
            'price' => $this->price,
            'active'  =>    $this->active,
            'slug'  =>  $this->slug,
            'created_at' => $this->created_at->format('d M Y')
        ];
    }
}
