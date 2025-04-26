<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EpisodeResource extends JsonResource
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
            'title' =>  $this->title,
            'episode_number' =>  $this->episode_number,
            'video_path' =>  $this->video(),
            'is_premium'  =>    $this->is_premium,
            'active'  =>    $this->active,
        ];
    }
}
