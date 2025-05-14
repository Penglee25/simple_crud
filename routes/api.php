<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserDetailsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('userdetails/fetch', [UserDetailsController::class, 'fetch']);
Route::post('userdetails/store', [UserDetailsController::class, 'store']);
Route::put('userdetails/update/{id}', [UserDetailsController::class, 'update']);
Route::delete('userdetails/destroy/{id}', [UserDetailsController::class, 'destroy']);
// Route::apiResource('userdetails', UserDetailsController::class);
