<?php

namespace App\Http\Resources;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovieResource extends JsonResource
{
    public static $wrap = false;
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
            'title' => $this->title,
            'slug'  => $this->slug,
            'categories' => $this->categories,
            'description' => $this->description,
            'episodes'   => EpisodeResource::newCollection($this->episodes),
            'episodes_count'   => $this->episodes->count(),
            'created_at'    =>  $this->created_at->format('d M Y'),
            'active'       =>   $this->active,
            'content_type'  =>  Str::title($this->content_type),
            'banner'    =>  $this->banner(),
            'banner_path'   =>  $this->banner()
        ];
    }
}
