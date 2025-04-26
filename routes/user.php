<?php

use Inertia\Inertia;


Route::middleware(['auth', 'verified'])->as('user.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('dashboard');
});
