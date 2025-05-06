<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Auth\Authenticatable;

class ProfileController extends Controller
{
    protected ?Authenticatable $user;

    public function __construct(Authenticatable $user)
    {
        $this->user = $user;
    }

    public function edit()
    {
        return Inertia::render('user/edit-profile', [
            'countries' => Country::orderBy('name')->get()->map(function ($query) {
                return [
                    'id' => $query->id,
                    'name' => $query->name,
                    'code' => $query->code,
                ];
            })
        ]);
    }

    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'country' => ['required', 'integer', 'exists:countries,id']
        ]);

        $validatedData['country_id'] = $validatedData['country'];
        unset($validatedData['country']);

        $this->user->update($validatedData);

        return redirect()->route('user.dashboard')->with('success', 'Profile Updated Successfully');
    }

    public function credentials()
    {
        return Inertia::render('user/edit-credentials');
    }

    public function updateCredentials(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => [
                'required',
                Rules\Password::defaults(),
                'confirmed',
                'min:6',
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
            'password_confirmation' => ['required', 'same:password'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('user.dashboard')->with('success', 'Credentials Updated Successfully');
    }
}
