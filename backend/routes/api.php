<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController as API;

// ========================================
// PUBLIC AUTHENTICATION
// ========================================

Route::post('/register', [API::class, 'register']);
Route::post('/login', [API::class, 'login']);
Route::post('/forgot-password', [API::class, 'forgotPassword']);
Route::post('/reset-password', [API::class, 'resetPassword']);


// ========================================
// PUBLIC CONTENT
// ========================================

Route::get('/categories', [API::class, 'categories']);
Route::get('/posts', [API::class, 'posts']);
Route::get('/posts/{post}', [API::class, 'showPost']);


// ========================================
// AUTHENTICATED USER ROUTES
// ========================================

Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::get('/me', [API::class, 'me']);
    Route::post('/logout', [API::class, 'logout']);

    // Profile
    Route::post('/profile', [API::class, 'updateProfile']);
    Route::put('/profile', [API::class, 'updateProfile']);

    // My recipes and bookmarks
    Route::get('/my-posts', [API::class, 'myPosts']);
    Route::get('/bookmarks', [API::class, 'myBookmarks']);

    // Recipe CRUD
    Route::post('/posts', [API::class, 'createPost']);

    // Normal update
    Route::put('/posts/{post}', [API::class, 'updatePost']);

    // FormData update (Laravel method spoofing support)
    Route::post('/posts/{post}', [API::class, 'updatePost']);

    Route::delete('/posts/{post}', [API::class, 'deletePost']);

    // Likes
    Route::post('/posts/{post}/like', [API::class, 'toggleLike']);

    // Bookmarks
    Route::post('/posts/{post}/bookmark', [API::class, 'toggleBookmark']);

    // Comments
    Route::post('/posts/{post}/comments', [API::class, 'comment']);
    Route::put('/comments/{comment}', [API::class, 'updateComment']);
    Route::delete('/comments/{comment}', [API::class, 'deleteComment']);

    // Ratings
    Route::post('/posts/{post}/ratings', [API::class, 'rate']);

    // Reports
    Route::post('/posts/{post}/reports', [API::class, 'report']);


    // ====================================
    // NOTIFICATIONS
    // ====================================

    Route::get('/notifications', [API::class, 'notifications']);

    Route::patch(
        '/notifications/{id}/read',
        [API::class, 'markNotificationRead']
    );

    Route::patch(
        '/notifications/read-all',
        [API::class, 'markAllNotificationsRead']
    );


    // ====================================
    // ADMIN ROUTES
    // ====================================

    Route::middleware('admin')->prefix('admin')->group(function () {

        // Dashboard and statistics
        Route::get('/stats', [API::class, 'adminStats']);

        // User management
        Route::get('/users', [API::class, 'adminUsers']);
        Route::post('/users', [API::class, 'adminCreateUser']);
        Route::get('/users/{user}', [API::class, 'adminUserDetails']);
        Route::patch('/users/{user}', [API::class, 'updateUser']);
        Route::patch('/users/{user}/ban', [API::class, 'toggleBan']);
        Route::delete('/users/{user}', [API::class, 'deleteUser']);

        // Post management
        Route::get('/posts', [API::class, 'adminPosts']);
        Route::patch('/posts/{post}/status', [API::class, 'updatePostStatus']);
        Route::delete('/posts/{post}', [API::class, 'deletePost']);

        // Report management
        Route::get('/reports', [API::class, 'adminReports']);
        Route::patch('/reports/{report}/resolve', [API::class, 'resolveReport']);
        

        // Category management
        Route::get('/categories', [API::class, 'adminCategories']);
        Route::post('/categories', [API::class, 'createCategory']);
        Route::put('/categories/{category}', [API::class, 'updateCategory']);
        Route::delete('/categories/{category}', [API::class, 'deleteCategory']);

    });

});