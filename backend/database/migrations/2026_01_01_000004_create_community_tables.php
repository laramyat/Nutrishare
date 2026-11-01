<?php
use Illuminate\Database\Migrations\Migration;use Illuminate\Database\Schema\Blueprint;use Illuminate\Support\Facades\Schema;
return new class extends Migration {public function up():void{
 Schema::create('comments',function(Blueprint $t){$t->id();$t->foreignId('user_id')->constrained()->cascadeOnDelete();$t->foreignId('food_post_id')->constrained()->cascadeOnDelete();$t->text('body');$t->timestamps();});
 Schema::create('likes',function(Blueprint $t){$t->id();$t->foreignId('user_id')->constrained()->cascadeOnDelete();$t->foreignId('food_post_id')->constrained()->cascadeOnDelete();$t->timestamps();$t->unique(['user_id','food_post_id']);});
 Schema::create('bookmarks',function(Blueprint $t){$t->id();$t->foreignId('user_id')->constrained()->cascadeOnDelete();$t->foreignId('food_post_id')->constrained()->cascadeOnDelete();$t->timestamps();$t->unique(['user_id','food_post_id']);});
 Schema::create('ratings',function(Blueprint $t){$t->id();$t->foreignId('user_id')->constrained()->cascadeOnDelete();$t->foreignId('food_post_id')->constrained()->cascadeOnDelete();$t->unsignedTinyInteger('rating');$t->text('review')->nullable();$t->timestamps();$t->unique(['user_id','food_post_id']);});
 Schema::create('reports',function(Blueprint $t){$t->id();$t->foreignId('user_id')->constrained()->cascadeOnDelete();$t->foreignId('food_post_id')->constrained()->cascadeOnDelete();$t->text('reason');$t->enum('status',['pending','resolved'])->default('pending');$t->timestamps();});
 }public function down():void{Schema::dropIfExists('reports');Schema::dropIfExists('ratings');Schema::dropIfExists('bookmarks');Schema::dropIfExists('likes');Schema::dropIfExists('comments');}};
