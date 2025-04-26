<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
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
        return [
            'name'     => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'string', 'min:6', 'max:255', 'unique:' . User::class],
            'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => [
                'required',
                'confirmed',
                'min:6',
                Rules\Password::defaults(),
                function ($attribute, $value, $fail) {
                    if (!preg_match('/[A-Z]/', $value)) {
                        $fail('The ' . $attribute . ' must contain at least one uppercase letter.');
                    }
                    if (!preg_match('/[a-z]/', $value)) {
                        $fail('The ' . $attribute . ' must contain at least one lowercase letter.');
                    }
                    if (!preg_match('/[0-9]/', $value)) {
                        $fail('The ' . $attribute . ' must contain at least one number.');
                    }
                }
            ],
            'password_confirmation' => ['required', 'same:password']
        ];
    }
}
