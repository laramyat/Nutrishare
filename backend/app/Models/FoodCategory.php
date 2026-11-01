<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class FoodCategory extends Model { protected $fillable=['name','slug','description']; public function posts(){return $this->hasMany(FoodPost::class,'category_id');} }
