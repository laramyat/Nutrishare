<?php

namespace App\Http\Controllers;

use App\Models\{
    User,
    FoodPost,
    FoodCategory,
    Comment,
    Like,
    Bookmark,
    Rating,
    Report
};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ApiController extends Controller
{
    /** Send a database notification to every administrator. */
    private function notifyAdmins(array $details): void
    {
        User::where('role', 'admin')->get()->each(function (User $admin) use ($details) {
            $admin->notify(new \App\Notifications\CommunityActivityNotification($details));
        });
    }

    // REGISTER
    public function register(Request $r)
    {
        $data = $r->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::create([
            ...$data,
            'role' => 'member'
        ]);

        // ADMIN NOTIFICATION 1: new member registered
        $this->notifyAdmins([
            'message' => $user->name . ' joined NutriShare.',
            'actor_id' => $user->id,
            'action' => 'new_member',
        ]);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('web')->plainTextToken
        ], 201);
    }

    // LOGIN
    public function login(Request $r)
    {
        $data = $r->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Email or password is incorrect'
            ], 422);
        }

        if ($user->is_banned) {
            return response()->json([
                'message' => 'Your account has been banned.'
            ], 403);
        }

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('web')->plainTextToken
        ]);
    }

    public function me(Request $r)
    {
        return response()->json($r->user());
    }

    public function logout(Request $r)
    {
        $r->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }

    // CATEGORIES
    public function categories()
    {
        return FoodCategory::orderBy('name')->get();
    }

    // FOOD POSTS
    public function posts(Request $r)
    {
        $q = FoodPost::with([
            'user:id,name,avatar',
            'category:id,name'
        ])
        ->withCount(['likes', 'comments', 'bookmarks'])
        ->withAvg('ratings', 'rating')
        ->where('status', 'published');

        if ($r->filled('search')) {
            $q->where(function ($x) use ($r) {
                $x->where('title', 'like', '%' . $r->search . '%')
                  ->orWhere('description', 'like', '%' . $r->search . '%')
                  ->orWhere('ingredients', 'like', '%' . $r->search . '%');
            });
        }

        if ($r->filled('category')) {
            $q->where('category_id', $r->category);
        }

        if ($r->filled('sort')) {
            if ($r->sort === 'popular') {
                $q->orderByDesc('likes_count');
            } elseif ($r->sort === 'rating') {
                $q->withAvg('ratings', 'rating')->orderByDesc('ratings_avg_rating');
            } else {
                $q->latest();
            }
        } else {
            $q->latest();
        }

        return $q->paginate(min(max((int) $r->input('per_page', 12), 1), 50));
    }

    public function showPost(Request $request, FoodPost $post)
    {
        $post->load([
            'user:id,name,avatar',
            'category',
            'comments.user:id,name,avatar',
            'ratings.user:id,name'
        ])->loadCount(['likes', 'comments']);

        $post->average_rating = round((float) $post->ratings()->avg('rating'), 1);
        $post->ratings_count = $post->ratings()->count();
        $post->my_rating = $request->user()
            ? $post->ratings()->where('user_id', $request->user()->id)->value('rating')
            : null;

        return response()->json($post);
    }

    public function createPost(Request $r)
    {
        $d = $r->validate([
            'category_id' => 'required|exists:food_categories,id',
            'title' => 'required|string|max:180',
            'description' => 'required|string',
            'image' => 'nullable|image|max:4096',
            'ingredients' => 'nullable|string',
            'instructions' => 'nullable|string',
            'prep_minutes' => 'nullable|integer|min:0',
            'cook_minutes' => 'nullable|integer|min:0',
            'servings' => 'nullable|integer|min:1',
            'calories' => 'nullable|numeric|min:0',
            'protein' => 'nullable|numeric|min:0',
            'carbs' => 'nullable|numeric|min:0',
            'fat' => 'nullable|numeric|min:0'
        ]);

        if ($r->hasFile('image')) {
            $d['image'] = $r->file('image')->store('food-posts', 'public');
        }

        $d['user_id'] = $r->user()->id;
        $d['status'] = 'published';

        $post = FoodPost::create($d)->load(['user', 'category']);

        // ADMIN NOTIFICATION 2: new recipe published
        $this->notifyAdmins([
            'message' => $r->user()->name . ' published a new recipe: "' . $post->title . '".',
            'post_id' => $post->id,
            'actor_id' => $r->user()->id,
            'action' => 'new_recipe',
        ]);

        return response()->json($post, 201);
    }

    public function updatePost(Request $r, FoodPost $post)
    {
        if (
            $r->user()->role !== 'admin' &&
            $post->user_id !== $r->user()->id
        ) {
            return response()->json([
                'message' => 'Not allowed'
            ], 403);
        }

        $d = $r->validate([
            'category_id' => 'sometimes|exists:food_categories,id',
            'title' => 'sometimes|string|max:180',
            'description' => 'sometimes|string',
            'image' => 'nullable|image|max:4096',
            'ingredients' => 'nullable|string',
            'instructions' => 'nullable|string',
            'prep_minutes' => 'nullable|integer|min:0',
            'cook_minutes' => 'nullable|integer|min:0',
            'servings' => 'nullable|integer|min:1',
            'calories' => 'nullable|numeric|min:0',
            'protein' => 'nullable|numeric|min:0',
            'carbs' => 'nullable|numeric|min:0',
            'fat' => 'nullable|numeric|min:0'
        ]);

        if ($r->hasFile('image')) {
            $d['image'] = $r->file('image')->store('food-posts', 'public');
        }

        $post->update($d);

        return $post->fresh()->load(['user', 'category']);
    }

    public function deletePost(Request $r, FoodPost $post)
    {
        if (
            $r->user()->role !== 'admin' &&
            $post->user_id !== $r->user()->id
        ) {
            return response()->json([
                'message' => 'Not allowed'
            ], 403);
        }

        $post->delete();

        return response()->json([
            'message' => 'Post deleted'
        ]);
    }

// LIKE
public function toggleLike(Request $r, FoodPost $post)
{
    $user = $r->user();

    $like = Like::where('user_id', $user->id)
        ->where('food_post_id', $post->id)
        ->first();

    if ($like) {
        $like->delete();
        $liked = false;
    } else {
        Like::create([
            'user_id' => $user->id,
            'food_post_id' => $post->id,
        ]);

        $liked = true;

        if ($post->user_id !== $user->id) {
            $post->loadMissing('user');
            $post->user?->notify(
                new \App\Notifications\CommunityActivityNotification([
                    'message' => $user->name . ' liked your recipe "' . $post->title . '".',
                    'post_id' => $post->id,
                    'actor_id' => $user->id,
                    'action' => 'like',
                ])
            );
        }

        // ADMIN NOTIFICATION 4: member community activity (new like)
        $this->notifyAdmins([
            'message' => $user->name . ' liked recipe "' . $post->title . '".',
            'post_id' => $post->id,
            'actor_id' => $user->id,
            'action' => 'member_activity',
        ]);
    }

    return response()->json([
        'liked' => $liked,
        'likes_count' => $post->likes()->count(),
        'comments_count' => $post->comments()->count(),
        'bookmarks_count' => $post->bookmarks()->count(),
    ]);
}
   

    
// BOOKMARK
public function toggleBookmark(Request $r, FoodPost $post)
{
    $user = $r->user();

    $bookmark = Bookmark::where('user_id', $user->id)
        ->where('food_post_id', $post->id)
        ->first();

    if ($bookmark) {
        $bookmark->delete();
        $saved = false;
    } else {
        Bookmark::create([
            'user_id' => $user->id,
            'food_post_id' => $post->id,
        ]);

        $saved = true;
    }

    return response()->json([
        'saved' => $saved,
        'likes_count' => $post->likes()->count(),
        'comments_count' => $post->comments()->count(),
        'bookmarks_count' => $post->bookmarks()->count(),
    ]);
}


// GET SAVED RECIPES FOR THE LOGGED-IN USER
public function myBookmarks(Request $request)
{
    $postIds = Bookmark::where('user_id', $request->user()->id)
        ->pluck('food_post_id');

    $savedRecipes = FoodPost::with([
        'user:id,name,avatar',
        'category:id,name',
    ])
        ->withCount(['likes', 'comments', 'bookmarks'])
        ->withAvg('ratings', 'rating')
        ->whereIn('id', $postIds)
        ->latest()
        ->get();

    return response()->json($savedRecipes);
}



        
// COMMENTS

public function comment(Request $r, FoodPost $post)
{
    $data = $r->validate([
        'body' => 'required|string|max:2000',
    ]);

    $comment = $post->comments()->create([
        'user_id' => $r->user()->id,
        'body' => $data['body'],
    ]);

    $comment->load('user:id,name');

    // Send notification to post owner
    if ($post->user_id !== $r->user()->id) {
        $post->loadMissing('user');
            $post->user?->notify(
            new \App\Notifications\CommunityActivityNotification([
                'message' => $r->user()->name .
                    ' commented on your recipe "' .
                    $post->title . '".',
                'post_id' => $post->id,
                'comment_id' => $comment->id,
                'actor_id' => $r->user()->id,
                'action' => 'comment',
            ])
        );
    }

    // ADMIN NOTIFICATION 4: member community activity (new comment)
    $this->notifyAdmins([
        'message' => $r->user()->name . ' commented on recipe "' . $post->title . '".',
        'post_id' => $post->id,
        'comment_id' => $comment->id,
        'actor_id' => $r->user()->id,
        'action' => 'member_activity',
    ]);

    return response()->json([
        'message' => 'Comment added successfully',
        'comment' => $comment,
    ], 201);
}


public function updateComment(Request $request, Comment $comment)
{
    if (
        $comment->user_id !== $request->user()->id &&
        $request->user()->role !== 'admin'
    ) {
        return response()->json([
            'message' => 'You cannot edit this comment.',
        ], 403);
    }

    $data = $request->validate([
        'body' => 'required|string|max:2000',
    ]);

    $comment->update([
        'body' => $data['body'],
    ]);

    return response()->json([
        'message' => 'Comment updated successfully',
        'comment' => $comment->fresh()->load('user:id,name'),
    ]);
}


public function deleteComment(Request $request, Comment $comment)
{
    if (
        $comment->user_id !== $request->user()->id &&
        $request->user()->role !== 'admin'
    ) {
        return response()->json([
            'message' => 'You cannot delete this comment.',
        ], 403);
    }

    $comment->delete();

    return response()->json([
        'message' => 'Comment deleted successfully',
    ]);
}


    // RATINGS
    
// RATINGS
public function rate(Request $r, FoodPost $post)
{
    $data = $r->validate([
        'rating' => 'required|integer|min:1|max:5',
        'review' => 'nullable|string|max:1000',
    ]);

    $user = $r->user();

    // Check whether this user has already rated this recipe
    $existingRating = Rating::where('user_id', $user->id)
        ->where('food_post_id', $post->id)
        ->first();

    // Create or update rating
    $rating = Rating::updateOrCreate(
        [
            'user_id' => $user->id,
            'food_post_id' => $post->id,
        ],
        $data
    );

    // Send notification only for the first rating
    if (!$existingRating && $post->user_id !== $user->id) {
        $post->loadMissing('user');
            $post->user?->notify(
            new \App\Notifications\CommunityActivityNotification([
                'message' => $user->name . ' rated your recipe.',
                'post_id' => $post->id,
                'actor_id' => $user->id,
                'action' => 'rating',
            ])
        );
    }

    // ADMIN NOTIFICATION 4: member community activity (new or updated rating)
    if (!$existingRating) {
        $this->notifyAdmins([
            'message' => $user->name . ' rated recipe "' . $post->title . '".',
            'post_id' => $post->id,
            'actor_id' => $user->id,
            'action' => 'member_activity',
        ]);
    }

    // Refresh rating statistics
    $averageRating = round(
        (float) $post->ratings()->avg('rating'),
        1
    );

    $ratingsCount = $post->ratings()->count();

    return response()->json([
        'message' => $existingRating
            ? 'Rating updated successfully'
            : 'Rating submitted successfully',

        'rating' => $rating,
        'average_rating' => $averageRating,
        'ratings_count' => $ratingsCount,
    ]);
}


    // REPORTS
    public function report(Request $r, FoodPost $post)
    {
        $d = $r->validate([
            'reason' => 'required|string|max:1000'
        ]);

        $report = Report::create([
            'user_id' => $r->user()->id,
            'food_post_id' => $post->id,
            'reason' => $d['reason'],
            'status' => 'pending'
        ]);

        // ADMIN NOTIFICATION 3: a member reported a recipe
        $this->notifyAdmins([
            'message' => $r->user()->name . ' reported recipe "' . $post->title . '".',
            'post_id' => $post->id,
            'actor_id' => $r->user()->id,
            'action' => 'new_report',
        ]);

        return response()->json([
            'message' => 'Report submitted successfully',
            'report' => $report,
        ], 201);
    }

    // ADMIN DASHBOARD ANALYTICS
    public function adminStats()
    {
        $start = now()->startOfMonth()->subMonths(5);
        $months = collect(range(0, 5))->map(function ($offset) use ($start) {
            $month = $start->copy()->addMonths($offset);
            $from = $month->copy()->startOfMonth();
            $to = $month->copy()->endOfMonth();

            return [
                'month' => $month->format('Y-m'),
                'label' => $month->format('M'),
                'total' => User::whereBetween('created_at', [$from, $to])->count(),
            ];
        })->values();

        $postActivity = collect(range(0, 5))->map(function ($offset) use ($start) {
            $month = $start->copy()->addMonths($offset);
            $from = $month->copy()->startOfMonth();
            $to = $month->copy()->endOfMonth();

            return [
                'month' => $month->format('Y-m'),
                'label' => $month->format('M'),
                'total' => FoodPost::whereBetween('created_at', [$from, $to])->count(),
            ];
        })->values();

        $postsByCategory = FoodCategory::query()
            ->withCount(['posts as total'])
            ->orderByDesc('total')
            ->get(['id', 'name'])
            ->map(fn ($category) => [
                'category' => $category->name,
                'total' => (int) $category->total,
            ])->values();

        return response()->json([
            'users' => User::count(),
            'posts' => FoodPost::count(),
            'categories' => FoodCategory::count(),
            'reports' => Report::where('status', 'pending')->count(),
            'charts' => [
                'user_growth' => $months,
                'post_activity' => $postActivity,
                'posts_by_category' => $postsByCategory,
            ],
        ]);
    }

    // ADMIN: SEARCH AND VIEW USERS
    public function adminUsers(Request $request)
    {
        $q = User::query();

        if ($request->filled('search')) {
            $search = $request->search;

            $q->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $q->where('role', $request->role);
        }

        if ($request->filled('status')) {
            if ($request->status === 'banned') {
                $q->where('is_banned', true);
            } elseif ($request->status === 'active') {
                $q->where('is_banned', false);
            }
        }

        return $q->select(
            'id',
            'name',
            'email',
            'role',
            'is_banned',
            'created_at'
        )->latest()->paginate(20);
    }

    // ADMIN: USER DETAILS
    public function adminUserDetails(User $user)
    {
        return response()->json([
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'is_banned',
                'created_at'
            ]),
            'posts' => FoodPost::where('user_id', $user->id)
                ->latest()
                ->get()
        ]);
    }

    // ADMIN: UPDATE USER
    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => [
                'sometimes', 'required', 'email',
                Rule::unique('users', 'email')->ignore($user->id)
            ],
            'role' => 'sometimes|required|in:admin,member'
        ]);

        if ($request->user()->id === $user->id && isset($data['role']) && $data['role'] !== 'admin') {
            return response()->json(['message' => 'You cannot remove your own admin role.'], 403);
        }
        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->fresh()
        ]);
    }

    // ADMIN: BAN / UNBAN
    public function toggleBan(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'You cannot ban your own account.'
            ], 403);
        }

        $requested = $request->input('is_banned');
        $user->is_banned = $request->has('is_banned')
            ? filter_var($requested, FILTER_VALIDATE_BOOLEAN)
            : !$user->is_banned;
        $user->save();

        if ($user->is_banned) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $user->is_banned
                ? 'User banned successfully'
                : 'User unbanned successfully',
            'is_banned' => (bool) $user->is_banned
        ]);
    }

    // ADMIN: DELETE USER
    public function deleteUser(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.'
            ], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    // ADMIN: REPORTS
    public function adminReports()
    {
        return Report::with([
            'user:id,name',
            'post:id,title'
        ])->latest()->paginate(20);
    }

    public function resolveReport(Report $report)
    {
        $report->update([
            'status' => 'resolved'
        ]);

        return response()->json($report);
    }

    // ADMIN: CATEGORIES
    public function adminCategories()
    {
        return FoodCategory::withCount('posts')
            ->orderBy('name')
            ->get();
    }

    public function createCategory(Request $r)
    {
        $d = $r->validate([
            'name' => 'required|string|max:80|unique:food_categories,name',
            'description' => 'nullable|string'
        ]);

        $d['slug'] = \Illuminate\Support\Str::slug($d['name']);

        return response()->json(
            FoodCategory::create($d),
            201
        );
    }

    public function deleteCategory(FoodCategory $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted'
        ]);
    }

    // FORGOT PASSWORD
    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        try {
            $status = Password::sendResetLink($validated);

            if ($status !== Password::RESET_LINK_SENT) {
                return response()->json([
                    'message' => __($status),
                ], 422);
            }

            return response()->json([
                'message' => 'Password reset link has been sent to your email.',
            ]);
        } catch (\Throwable $e) {
            Log::error('NutriShare forgot password failed', [
                'email' => $validated['email'],
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Unable to send the password reset email. Please check the mail configuration.',
            ], 500);
        }
    }

    // RESET PASSWORD
    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $status = Password::reset(
            $data,
            function ($user, string $password) {
                // User.php has the Laravel "hashed" password cast.
                $user->forceFill([
                    'password' => $password,
                ])->save();

                // Revoke existing sessions/tokens after a password reset.
                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'message' => 'Password reset successfully. Please sign in.',
        ]);
    }


    // MEMBER PROFILE
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'bio' => 'nullable|string|max:1000',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) Storage::disk('public')->delete($user->avatar);
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);
        return response()->json(['message' => 'Profile updated successfully', 'user' => $user->fresh()]);
    }

public function myPosts(Request $request)
{
    $userId = $request->user()->id;

    return FoodPost::with(['user:id,name,avatar', 'category'])
        ->withCount(['likes', 'comments', 'bookmarks'])
        ->withExists([
            'likes as is_liked' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            },
            'bookmarks as is_saved' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            },
        ])
        ->where('user_id', $userId)
        ->latest()
        ->paginate(12);
}

    // ADMIN: UPDATE / DELETE CATEGORY
    public function updateCategory(Request $request, FoodCategory $category)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80', Rule::unique('food_categories', 'name')->ignore($category->id)],
            'description' => 'nullable|string|max:1000',
        ]);
        $data['slug'] = \Illuminate\Support\Str::slug($data['name']);
        $category->update($data);
        return response()->json(['message' => 'Category updated', 'category' => $category->fresh()]);
    }

    public function adminCreateUser(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,member',
        ]);
        $data['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);
        $user = User::create($data);
        return response()->json(['message' => 'User created', 'user' => $user], 201);
    }

    public function adminPosts(Request $request)
    {
        $query = FoodPost::with(['user:id,name', 'category'])
            ->withCount(['likes', 'comments']);
        if ($request->filled('search')) {
            $term = $request->string('search');
            $query->where(fn($q) => $q->where('title', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%"));
        }
        if ($request->filled('status')) $query->where('status', $request->status);
        return $query->latest()->paginate(20);
    }

// ========================================
// ADMIN: UPDATE POST STATUS
// ========================================

public function updatePostStatus(Request $request, FoodPost $post)
{
    try {
        // Validate status
        $data = $request->validate([
            'status' => 'required|string|in:published,hidden',
        ]);

        // Update post status
        $post->status = $data['status'];
        $post->save();

        // Return updated post
        return response()->json([
            'success' => true,
            'message' => 'Post status updated successfully.',
            'post' => $post->fresh()->load([
                'user:id,name,avatar',
                'category',
            ]),
        ], 200);

    } catch (\Illuminate\Validation\ValidationException $e) {
        throw $e;

    } catch (\Throwable $e) {
        \Log::error('Update Post Status Error: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Unable to update post status.',
        ], 500);
    }
}

    
    // MEMBER NOTIFICATIONS
    public function notifications(Request $request)
    {
        return response()->json([
            'data' => $request->user()->notifications()->latest()->limit(50)->get(),
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    public function markNotificationRead(Request $request, string $id)
    {
        $notification = $request->user()->notifications()->whereKey($id)->firstOrFail();
        $notification->markAsRead();
        return response()->json([
            'message' => 'Notification marked as read',
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    public function markAllNotificationsRead(Request $request)
    {
        $request->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return response()->json([
            'message' => 'All notifications marked as read',
            'unread_count' => 0,
        ]);
    }

}
