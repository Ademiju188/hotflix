<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'id'     =>  $this->id,
            'uuid'   =>  $this->uuid,
            'role'   => $this->role,
            'name'   =>  $this->name,
            'username'  =>  $this->username,
            'email'      =>  $this->email,
            'dashboard'     => $this->dashboard(),
        ];
    }
}
