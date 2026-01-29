<?php

use App\Http\Controllers\CodingToolController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PermissionGroupController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TierController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Get latest published courses
    $courses = \App\Models\Course::with([
        'courseImages', 
        'courseMentors.user'
    ])
    ->where('is_published', true)
    ->latest()
    ->take(8)
    ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'courses' => $courses
    ]);
});

Route::get('/course/{id}', [CourseController::class, 'show'])->name('course.show');

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

    // User Routes
    Route::group(['prefix' => 'users'], function () {
        Route::get("/", [UserController::class, 'index'])->name('user.index');
    });

    // Role Routes
    Route::resource('roles', RoleController::class)->names('role');

    // Permission Routes
    Route::resource('permissions', PermissionController::class)->only(['index', 'store', 'destroy'])->names('permission');
    
    // Permission Group Routes
    Route::resource('permission-groups', PermissionGroupController::class)->only(['index', 'store', 'destroy'])->names('permission-group');

    // Coding Tool Routes
    Route::group(['prefix' => 'coding-tools'], function () {
        Route::get("/", [CodingToolController::class, 'index'])->name('coding-tool.index');
        Route::post("/", [CodingToolController::class, 'store'])->name('coding-tool.store');
    });

    // Course Routes
    Route::group(['prefix' => 'courses'], function () {
        Route::get("/", [CourseController::class, 'index'])->name('course.index');
        Route::get('/create', [CourseController::class, 'create'])->name('course.create');
        Route::post('/', [CourseController::class, 'store'])->name('course.store');
        Route::post('/validate-step-1', [CourseController::class, 'validateStep1'])->name('course.validate-step-1');
        Route::post('/subcourses', [CourseController::class, 'storeSubCourses'])->name('course.subcourse.store');
        Route::patch('/{id}/status', [CourseController::class, 'updateStatus'])->name('course.update-status');
        // Route::put('/{id}', [CourseController::class, 'update'])->name('course.update');
        // Route::delete('/{id}', [CourseController::class, 'destroy'])->name('course.destroy');
    });
});

require __DIR__.'/auth.php';
