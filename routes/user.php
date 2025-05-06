<?php


use Inertia\Inertia;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\SubscriptionController;


Route::middleware(['auth', 'verified', 'user'])->as('user.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('dashboard');

    Route::prefix('profile')->as('profile.')->group(function() {
        Route::get('edit', [ProfileController::class, 'edit'])->name('edit');
        Route::get('credentials', [ProfileController::class, 'credentials'])->name('credentials');
        Route::post('update', [ProfileController::class, 'update'])->name('update');
        Route::post('update-credentials', [ProfileController::class, 'updateCredentials'])->name('updateCredentials');
    });

    Route::get('payments', [PaymentController::class, 'index'])->name('payment.index');
    Route::get('subscriptions', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::get('subscriptions/cancel', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');
    Route::post('subscriptions/update-subscription', [SubscriptionController::class, 'update'])->name('subscription.update');
});
