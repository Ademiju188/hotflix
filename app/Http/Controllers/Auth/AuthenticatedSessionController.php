<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Lockout;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $this->ensureIsNotRateLimited($request);

        $credentials = $this->prepareCredentials($validated);
        $remember = $request->boolean('remember');

        foreach ($credentials as $credential) {
            if (Auth::attempt($credential, $remember)) {
                return $this->handleSuccessfulAuthentication($request);
            }
        }

        $this->handleFailedAuthentication($request);
    }

    protected function prepareCredentials(array $validated): array
    {
        return [
            ['email' => $validated['username'], 'password' => $validated['password']],
            ['username' => $validated['username'], 'password' => $validated['password']],
        ];
    }

    protected function handleSuccessfulAuthentication(Request $request)
    {
        if (!auth()->user()->is_active || auth()->user()->is_block) {
            $this->invalidateSession();
            throw ValidationException::withMessages([
                'username' => __('Your account has been suspended. Contact the support to reactivate your account.'),
            ]);
        }

        RateLimiter::clear($this->throttleKey($request));
        $request->session()->regenerate();

        if (auth()->user()->isViewer()) {
            session()->flash('success', 'Logged In Successfully');
            return redirect()->route('home');
        }

        return redirect()->intended(auth()->user()->dashboard());
    }

    protected function handleFailedAuthentication(Request $request)
    {
        RateLimiter::hit($this->throttleKey($request));
        throw ValidationException::withMessages([
            'username' => __('auth.failed'),
        ]);
    }

    protected function invalidateSession()
    {
        auth()->logout();
        session()->invalidate();
        session()->regenerateToken();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function ensureIsNotRateLimited($request): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) {
            return;
        }

        event(new Lockout($request));

        $seconds = RateLimiter::availableIn($this->throttleKey($request));

        throw ValidationException::withMessages([
            'username' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey($request): string
    {
        return Str::transliterate(Str::lower($request->username) . '|' . $request->ip());
    }
}
