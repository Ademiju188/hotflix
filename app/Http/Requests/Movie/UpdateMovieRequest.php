<?php

namespace App\Http\Requests\Movie;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMovieRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // dd(request()->all());
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            // 'featured' => 'boolean',
            // 'premium' => 'boolean',
            'episode_number' => 'required|integer|min:1',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'existing_banner' => 'nullable|string',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'episodes' => 'required|array',
            'episodes.*.id' => 'required',
            'episodes.*.video' => 'nullable|file|mimetypes:video/mp4,video/x-m4v,video/quicktime',
            'episodes.*.existing_video' => 'nullable|string',
            'episodes.*.is_premium' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            // 'episodes.*.video.max' => 'Episode videos must not exceed 100MB',
            'episodes.*.video.mimetypes' => 'Only MP4, M4V, and QuickTime videos are allowed',
            'categories.required' => 'Please select at least one category',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // foreach ($this->input('episodes', []) as $index => $episode) {
            //     if (empty($episode['video']) && empty($episode['existing_video'])) {
            //         $validator->errors()->add("episodes.$index.video", 'Either a new video or existing video must be provided');
            //     }
            // }

            if (empty($this->file('banner')) && empty($this->input('existing_banner'))) {
                $validator->errors()->add('banner', 'Either a new banner or existing banner must be provided');
            }
        });
    }

    public function prepareForValidation()
    {
        if ($this->has('categories') && !is_array($this->categories)) {
            $this->merge([
                'categories' => (array)$this->categories
            ]);
        }
    }
}
