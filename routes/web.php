<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SubscriptionController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/pricing', [HomeController::class, 'pricing'])->name('pricing');
Route::get('video/{movie:uuid}', [HomeController::class, 'movieDetails'])->name('movie-details');

Route::post('process-subscription/{plan:uuid}', [SubscriptionController::class, 'checkout'])->name('process-subscription')->middleware('auth');
Route::get('process-checkout', [SubscriptionController::class, 'verify'])->name('process-checkout')->middleware('auth');


// require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/user.php';
