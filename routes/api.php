<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CharacterController;

Route::get('/characters/fetch', [CharacterController::class, 'fetch']);
Route::post('/characters/store', [CharacterController::class, 'store']);
Route::get('/characters', [CharacterController::class, 'all']);
Route::put('/characters/{id}', [CharacterController::class, 'update']);
