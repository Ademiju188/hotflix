<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'    => $this->id,
            'uuid'  => $this->uuid,
            'name'  => $this->name,
            'active' => (int) $this->active,
            'description' => $this->description,
            'created_at' => $this->created_at->format('d-M-Y'),
        ];
    }
}
