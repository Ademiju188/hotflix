<?php

namespace App\Http\Requests\Movie;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMovieRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        // dd(request()->all());
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'featured' => 'boolean',
            'premium' => 'boolean',
            'episode_number' => 'required|integer|min:1|max:100',
            'banner' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'episodes' => 'required|array|size:' . $this->input('episode_number'),
            'episodes.*.video' => 'required|file|mimetypes:video/mp4,video/x-m4v,video/quicktime', // 100MB max
            'episodes.*.is_premium' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            'episodes.size' => 'The number of episodes must match the episode count.',
            'episodes.*.video.required' => 'Each episode must have a video file.',
            // 'episodes.*.video.max' => 'Episode videos must not exceed 100MB.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('episode_number') != count($this->file('episodes', []))) {
                $validator->errors()->add('episodes', 'The number of uploaded episodes must match the episode count.');
            }
        });
    }
}
