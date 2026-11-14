<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\FoodPost;

class Rating extends Model
{
    protected $fillable = [
        'user_id',
        'food_post_id',
        'rating',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function foodPost()
    {
        return $this->belongsTo(FoodPost::class, 'food_post_id');
    }
}
