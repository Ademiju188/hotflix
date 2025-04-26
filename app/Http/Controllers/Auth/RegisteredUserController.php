<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Enums\RolesEnum;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;
use App\Http\Requests\Auth\RegisterRequest;

class RegisteredUserController extends Controller
{

    protected ?UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        try {
            return DB::transaction(function () use ($request) {
                $data = [
                    'name' => trim($request->name),
                    'username' => trim($request->username),
                    'email' => trim($request->email),
                    'role_id' => self::assignRoleToUser()->id,
                    'password' => Hash::make($request->password),
                ];

                $user = $this->userRepository->create($data);

                $role = self::assignRoleToUser();

                $user->assignRole($role);

                event(new Registered($user));

                Auth::login($user);
                session()->flash('success', 'Registration successful! Please check your email to verify your account.');
                return redirect()->route('verification.notice');
            });
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return redirect()->back()->withErrors('Failed to send verification email. Please try again later.');
        }
    }

    protected static function assignRoleToUser()
    {
        return Role::where('name', RolesEnum::Viewer->value)->first();
    }
}
