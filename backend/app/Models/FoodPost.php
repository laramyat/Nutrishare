<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class FoodPost extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'image',
        'ingredients',
        'instructions',
        'calories',
        'protein',
        'carbs',
        'fat',
        'prep_time',
        'cook_time',
        'servings',
    ];

    protected $casts = [
        'calories' => 'decimal:1',
        'protein' => 'decimal:1',
        'carbs' => 'decimal:1',
        'fat' => 'decimal:1',
    ];

    // User relationship
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Category relationship
    public function category()
    {
        return $this->belongsTo(FoodCategory::class, 'category_id');
    }

    // Comments relationship
    public function comments()
    {
        return $this->hasMany(Comment::class, 'food_post_id');
    }

    // Likes relationship
    public function likes()
    {
        return $this->hasMany(Like::class, 'food_post_id');
    }

    // Bookmarks relationship
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class, 'food_post_id');
    }

    // Ratings relationship
    public function ratings()
    {
        return $this->hasMany(Rating::class, 'food_post_id');
    }
}
