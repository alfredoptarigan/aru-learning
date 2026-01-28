<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TierController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');



    // Tier Routes
    Route::group(['prefix' => 'tiers'], function () {
        Route::get("/", [TierController::class, 'index'])->name('tier.index');
        Route::get('/create', [TierController::class, 'create'])->name('tier.create');
        Route::post('/', [TierController::class, 'store'])->name('tier.store');
        Route::put('/{id}', [TierController::class, 'update'])->name('tier.update');
        Route::delete('/{id}', [TierController::class, 'destroy'])->name('tier.destroy');
    });

    // Course Routes
    Route::get('/courses', [CourseController::class, 'index'])->name('course.index');
});

require __DIR__.'/auth.php';
