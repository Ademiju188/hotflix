<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HeroSliderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'   => $this->id,
            'movie_id'  =>  $this->movie_id,
            'hierarchy' => $this->hierarchy,
            'movie' => MovieResource::make($this->movie),
            'created_at' => $this->created_at->format('d M Y')
        ];
    }
}
