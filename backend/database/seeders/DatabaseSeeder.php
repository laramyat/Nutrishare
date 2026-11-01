<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\{User,FoodCategory,FoodPost};
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder {
 public function run():void {
  $admin=User::updateOrCreate(['email'=>'admin@nutrishare.com'],['name'=>'NutriShare Admin','password'=>Hash::make('Admin@123'),'role'=>'admin']);
  $member=User::updateOrCreate(['email'=>'member@nutrishare.com'],['name'=>'Maya Chen','password'=>Hash::make('Member@123'),'role'=>'member']);
  $cats=['Breakfast','Lunch','Dinner','Healthy Snacks','Vegetarian Food','Low-Calorie Food','High-Protein Food','Healthy Drinks'];
  foreach($cats as $name)FoodCategory::firstOrCreate(['slug'=>\Illuminate\Support\Str::slug($name)],['name'=>$name]);
  $lunch=FoodCategory::where('name','Lunch')->first();
  FoodPost::firstOrCreate(['title'=>'Berry Overnight Oats'],['user_id'=>$member->id,'category_id'=>FoodCategory::where('name','Breakfast')->first()->id,'description'=>'Make-ahead oats with berries, chia seeds and yoghurt.','image'=>'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=1000','ingredients'=>'Rolled oats, milk, Greek yoghurt, chia seeds, berries','instructions'=>'Mix oats, milk, yoghurt and chia. Refrigerate overnight. Add berries.','prep_minutes'=>10,'cook_minutes'=>0,'servings'=>1,'calories'=>310,'protein'=>14,'carbs'=>42,'fat'=>9,'status'=>'published']);
  FoodPost::firstOrCreate(['title'=>'Green Goddess Nourish Bowl'],['user_id'=>$member->id,'category_id'=>$lunch->id,'description'=>'A fresh bowl packed with greens, avocado, quinoa and a lemon dressing.','image'=>'https://images.unsplash.com/photo-1512621776951-a57141f2eeed?w=1000','ingredients'=>'Quinoa, avocado, cucumber, spinach, chickpeas, lemon','instructions'=>'Cook quinoa. Chop vegetables. Toss together with dressing.','prep_minutes'=>15,'cook_minutes'=>15,'servings'=>2,'calories'=>420,'protein'=>18,'carbs'=>48,'fat'=>16,'status'=>'published']);
 }
}
