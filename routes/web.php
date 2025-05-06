<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SubscriptionController;

Route::get('/', [HomeController::class, 'index'])->name('home');
// Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/pricing', [HomeController::class, 'pricing'])->name('pricing');
Route::get('video/{movie:uuid}', [HomeController::class, 'movieDetails'])->name('movie-details');

Route::post('process-subscription/{plan:uuid}', [SubscriptionController::class, 'checkout'])->name('process-subscription')->middleware('auth');
Route::get('process-checkout', [SubscriptionController::class, 'verify'])->name('process-checkout')->middleware('auth');


// require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/user.php';


Route::get('/run-deployment', function () {
    // Validate required query parameters
    if (!request()->has('token') || !request()->has('check_table')) {
        abort(403, 'Missing required parameters');
    }

    // Verify deployment token
    if (request()->query('token') !== config('app.deployment_token')) {
        abort(403, 'Invalid deployment token');
    }

    // Verify the check_table exists and has records
    try {
        $tableExists = Schema::hasTable(request()->query('check_table'));
        $hasRecords = $tableExists ? DB::table(request()->query('check_table'))->exists() : false;

        if (!$tableExists || !$hasRecords) {
            abort(403, 'Validation failed: Table check unsuccessful');
        }
    } catch (\Exception $e) {
        abort(403, 'Table validation error: ' . $e->getMessage());
    }

    // Execute deployment commands
    try {
        $output = [];

        // Test database connection
        DB::connection()->getPdo();
        $output[] = "Connected successfully to: " . DB::connection()->getDatabaseName();

        // Run migrations
        Artisan::call('migrate --force');
        $output[] = "Migrations:\n" . Artisan::output();

        // Run seeders
        Artisan::call('db:seed --force');
        $output[] = "Seeders:\n" . Artisan::output();

        // Create storage link
        Artisan::call('storage:link');
        $output[] = "Storage:\n" . Artisan::output();

        return response()->make(implode("\n\n", $output), 200, [
            'Content-Type' => 'text/plain'
        ]);

    } catch (\Exception $e) {
        return response()->make("Deployment failed:\n" . $e->getMessage(), 500, [
            'Content-Type' => 'text/plain'
        ]);
    }
})->middleware('throttle:3,1'); // Limit to 3 requests per minute
