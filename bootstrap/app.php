<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RedirectIfNotSuperAdmin;
use App\Http\Middleware\RedirectIfNotUser;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(['appearance', 'sidebar_state']);
        $middleware->redirectGuestsTo(fn () => route('login'));
        // $middleware->redirectUsersTo(fn () => Auth::user()->re_route_dashboard());
        $middleware->web()->statefulApi();
        $middleware->alias([
            'guest'       => \App\Http\Middleware\OnlyGuestAllowedMiddleware::class,
            'superadmin'  => \App\Http\Middleware\RedirectIfNotSuperAdmin::class,
        ]);
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
