<?php

use App\Http\Controllers\System\CategoryController;
use App\Http\Controllers\System\HeroSliderSettingsController;
use App\Http\Controllers\System\MovieController;
use App\Http\Controllers\System\PricingController;
use Inertia\Inertia;


Route::prefix('system')->middleware(['auth', 'superadmin'])->as('system.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::prefix('categories')->as('category.')->group(function () {
        Route::get('/', [CategoryController::class,'index'])->name('index');
        Route::get('/create', [CategoryController::class,'create'])->name('create');
        Route::post('/store', [CategoryController::class,'store'])->name('store');
        Route::post('/{category:id}/update', [CategoryController::class,'update'])->name('update');
        Route::post('/{category:id}/destroy', [CategoryController::class,'destroy'])->name('destroy');
    });

    Route::prefix('pricing')->as('pricing.')->group(function () {
        Route::get('/', [PricingController::class, 'index'])->name('index');
        Route::post('/store', [PricingController::class, 'store'])->name('store');
        Route::post('/reorder', [PricingController::class, 'reorder'])->name('reorder');
        Route::post('/{plan:id}/update', [PricingController::class, 'update'])->name('update');
        Route::delete('/{plan:id}/destroy', [PricingController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('movies')->as('movie.')->group(function () {
        Route::get('/', [MovieController::class, 'index'])->name('index');
        Route::get('/create', [MovieController::class, 'create'])->name('create');
        Route::post('/store', [MovieController::class, 'store'])->name('store');
        Route::get('/{movie:uuid}/edit', [MovieController::class, 'edit'])->name('edit');
        Route::put('/{movie:id}/status', [MovieController::class, 'updateMovieStatus'])->name('status');
        Route::put('/{episode:id}/status', [MovieController::class, 'updateStatus'])->name('episode.status');
        Route::post('/{movie:id}/update', [MovieController::class, 'update'])->name('update');
        Route::delete('/{movie:id}/delete', [MovieController::class, 'destroy'])->name('destroy');
        Route::delete('/{episode:id}/delete', [MovieController::class, 'deleteEpisode'])->name('episode.destroy');
        Route::delete('/{movie:id}/banner/delete', [MovieController::class, 'deleteBanner'])->name('banner.destroy');
    });

    Route::prefix('settings')->as('settings.')->group(function() {
        Route::prefix('hero-sliders')->as('hero-slider.')->group(function() {
            Route::get('/', [HeroSliderSettingsController::class,'index'])->name('index');
            Route::post('/store', [HeroSliderSettingsController::class,'store'])->name('store');
            Route::post('/reorder', [HeroSliderSettingsController::class, 'reorder'])->name('reorder');
            Route::post('/{slider:id}/destroy', [HeroSliderSettingsController::class, 'destroy'])->name('destroy');
        });
    });
});
