<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Storage;

class AppServiceProvider extends ServiceProvider
{

    public function boot(): void
    {
        if (!Storage::exists('public/photos')) {
            Storage::makeDirectory('public/photos');
        }

        Vite::prefetch(concurrency: 3);
        // Load API routes manually
        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('routes/api.php'));

        // Load Web routes (optional, if not already loaded)
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

}
