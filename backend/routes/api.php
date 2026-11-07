<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController as API;

// Public authentication
Route::post('/register', [API::class, 'register']);
Route::post('/login', [API::class, 'login']);
Route::post('/forgot-password', [API::class, 'forgotPassword']);
Route::post('/reset-password', [API::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [API::class, 'notifications']);
    Route::patch('/notifications/{id}/read', [API::class, 'markNotificationRead']);
    Route::patch('/notifications/read-all', [API::class, 'markAllNotificationsRead']);
});

// Public content
Route::get('/categories', [API::class, 'categories']);
Route::get('/posts', [API::class, 'posts']);
Route::get('/posts/{post}', [API::class, 'showPost']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [API::class, 'me']);
    Route::post('/logout', [API::class, 'logout']);

    // Member features
    Route::post('/posts', [API::class, 'createPost']);
    Route::put('/posts/{post}', [API::class, 'updatePost']);
    Route::delete('/posts/{post}', [API::class, 'deletePost']);
    Route::post('/posts/{post}/like', [API::class, 'toggleLike']);
    Route::post('/posts/{post}/bookmark', [API::class, 'toggleBookmark']);
    Route::get('/bookmarks', [API::class, 'myBookmarks']);
    Route::post('/posts/{post}/comments', [API::class, 'comment']);
    Route::post('/posts/{post}/ratings', [API::class, 'rate']);
    Route::post('/posts/{post}/reports', [API::class, 'report']);

    // Notifications
    Route::get('/notifications', [API::class, 'notifications']);
    Route::patch('/notifications/{id}/read', [API::class, 'markNotificationRead']);
    Route::patch('/notifications/read-all', [API::class, 'markAllNotificationsRead']);

    // Admin features
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/stats', [API::class, 'adminStats']);
        Route::get('/users', [API::class, 'adminUsers']);
        Route::get('/users/{user}', [API::class, 'adminUserDetails']);
        Route::patch('/users/{user}', [API::class, 'updateUser']);
        Route::patch('/users/{user}/ban', [API::class, 'toggleBan']);
        Route::delete('/users/{user}', [API::class, 'deleteUser']);
        Route::get('/reports', [API::class, 'adminReports']);
        Route::patch('/reports/{report}/resolve', [API::class, 'resolveReport']);
        Route::get('/categories', [API::class, 'adminCategories']);
        Route::post('/categories', [API::class, 'createCategory']);
        Route::delete('/categories/{category}', [API::class, 'deleteCategory']);
    });
});
