<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class FoodPost extends Model {
 protected $fillable=['user_id','category_id','title','description','image','ingredients','instructions','prep_minutes','cook_minutes','servings','calories','protein','carbs','fat','status'];
 protected $casts=['calories'=>'decimal:1','protein'=>'decimal:1','carbs'=>'decimal:1','fat'=>'decimal:1'];
 public function user(){return $this->belongsTo(User::class);}
 public function category(){return $this->belongsTo(FoodCategory::class,'category_id');}
 public function comments(){return $this->hasMany(Comment::class);}
 public function likes(){return $this->hasMany(Like::class);}
 public function bookmarks(){return $this->hasMany(Bookmark::class);}
 public function ratings(){return $this->hasMany(Rating::class);}
}
