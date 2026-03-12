<?php

use App\Http\Controllers\EditionController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\ParticipantEditionController;
use App\Http\Controllers\ParticipationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => redirect()->route('editions.index'));

Route::middleware(['auth', 'verified'])->group(function () {

    // Ediciones (vista participante)
    Route::get('editions', [ParticipantEditionController::class, 'index'])->name('editions.index');
    Route::get('editions/{edition}', [ParticipantEditionController::class, 'show'])->name('editions.show');

    // Votos
    Route::post('votes', [VoteController::class, 'store'])->name('votes.store');
    Route::get('editions/{edition}/results', [VoteController::class, 'results'])->name('editions.results');

    // Grupos
    Route::post('groups/{group}/ready', [GroupController::class, 'ready'])->name('groups.ready');

    // Participaciones
    Route::delete('participations/{participation}', [ParticipationController::class, 'destroy'])->name('participations.destroy');
});

// Panel Admin
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Ediciones
    Route::resource('editions', EditionController::class);
    Route::post('editions/{edition}/transition', [EditionController::class, 'transition'])
        ->name('editions.transition');

    // Categorías
    Route::post('editions/{edition}/categories', [CategoryController::class, 'store'])
        ->name('categories.store');
    Route::put('categories/{category}', [CategoryController::class, 'update'])
        ->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])
        ->name('categories.destroy');

    // Grupos
    Route::post('editions/{edition}/groups', [GroupController::class, 'store'])
        ->name('groups.store');
    Route::put('groups/{group}', [GroupController::class, 'update'])
        ->name('groups.update');
    Route::delete('groups/{group}', [GroupController::class, 'destroy'])
        ->name('groups.destroy');
    Route::post('groups/{group}/reveal', [GroupController::class, 'reveal'])
        ->name('groups.reveal');

    // Participaciones
    Route::post('groups/{group}/participations', [ParticipationController::class, 'store'])
        ->name('participations.store');
    Route::delete('participations/{participation}', [ParticipationController::class, 'destroy'])
        ->name('admin.participations.destroy');
});

require __DIR__ . '/auth.php';