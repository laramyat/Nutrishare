
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController as API;

// Public Authentication
Route::post('/register', [API::class, 'register']);
Route::post('/login', [API::class, 'login']);

// Public Features
Route::get('/categories', [API::class, 'categories']);
Route::get('/posts', [API::class, 'posts']);
Route::get('/posts/{post}', [API::class, 'showPost']);

// Authenticated Features
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::get('/me', [API::class, 'me']);
    Route::post('/logout', [API::class, 'logout']);

    // Member Features
    Route::post('/posts', [API::class, 'createPost']);
    Route::put('/posts/{post}', [API::class, 'updatePost']);
    Route::delete('/posts/{post}', [API::class, 'deletePost']);

    Route::post('/posts/{post}/like', [API::class, 'toggleLike']);
    Route::post('/posts/{post}/bookmark', [API::class, 'toggleBookmark']);
    Route::get('/bookmarks', [API::class, 'myBookmarks']);

    Route::post('/posts/{post}/comments', [API::class, 'comment']);
    Route::post('/posts/{post}/ratings', [API::class, 'rate']);
    Route::post('/posts/{post}/reports', [API::class, 'report']);

    // Admin Features
    Route::middleware('admin')->prefix('admin')->group(function () {

        // Dashboard
        Route::get('/stats', [API::class, 'adminStats']);

        // User Management
        Route::get('/users', [API::class, 'adminUsers']);
        Route::get('/users/{user}', [API::class, 'adminUserDetails']);
        Route::put('/users/{user}', [API::class, 'updateUser']);
        Route::patch('/users/{user}/ban', [API::class, 'toggleBan']);
        Route::delete('/users/{user}', [API::class, 'deleteUser']);

        // Reports Management
        Route::get('/reports', [API::class, 'adminReports']);
        Route::patch('/reports/{report}/resolve', [API::class, 'resolveReport']);

        // Category Management
        Route::get('/categories', [API::class, 'adminCategories']);
        Route::post('/categories', [API::class, 'createCategory']);
        Route::delete('/categories/{category}', [API::class, 'deleteCategory']);
    });
});
