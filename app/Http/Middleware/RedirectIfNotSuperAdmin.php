<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfNotSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // dd(user()->isAdmin());
        if (auth()->check() && !user()->isSuperAdmin() && !user()->isAdmin()) {
            return redirect(route('home'))->withErrors("You are Allowed to Access this Page!.");
        }

        return $next($request);
    }
}
