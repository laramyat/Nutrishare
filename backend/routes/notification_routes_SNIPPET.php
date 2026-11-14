<?php
// Add these INSIDE your existing Route::middleware('auth:sanctum')->group(function () { ... });
// Do not replace your existing routes/api.php with this snippet.
use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;

Route::get('/notifications', [ApiController::class, 'notifications']);
Route::patch('/notifications/read-all', [ApiController::class, 'markAllNotificationsRead']);
Route::patch('/notifications/{id}/read', [ApiController::class, 'markNotificationRead']);
