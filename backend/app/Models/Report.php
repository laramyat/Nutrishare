<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Report extends Model { protected $fillable=['user_id','food_post_id','reason','status']; public function user(){return $this->belongsTo(User::class);} public function post(){return $this->belongsTo(FoodPost::class,'food_post_id');} }
