<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\FonnteSettingController;
use Illuminate\Foundation\Application;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;

// PUBLIC
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

// GENERAL
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// STUDENT
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('tasks', TaskController::class);

    Route::patch(
        'tasks/{task}/subtasks/{subtask}/toggle',
        [TaskController::class, 'toggleSubtask']
    )->name('tasks.subtasks.toggle');

    Route::patch('/tasks/{task}/complete', [TaskController::class, 'complete'])
        ->name('tasks.complete');

    Route::get('/history', [HistoryController::class, 'index'])
        ->name('history');
});

// ADMIN
Route::middleware(['auth', AdminMiddleware::class])->group(function () {

    Route::get('/adminDashboard', [AdminDashboardController::class, 'index'])
        ->name('admin.dashboard');

    Route::post('/adminFonnte', [FonnteSettingController::class, 'updateFonnte'])
        ->name('admin.fonnte.update');

    // Tambahkan route admin lainnya di sini
    // Route::get('/adminUsers', [AdminUserController::class, 'index'])->name('admin.users');
    // Route::get('/adminTasks', [AdminTaskController::class, 'index'])->name('admin.tasks');
});

require __DIR__ . '/auth.php';
