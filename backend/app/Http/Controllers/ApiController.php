<?php
namespace App\Http\Controllers;
use App\Models\{User,FoodPost,FoodCategory,Comment,Like,Bookmark,Rating,Report};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ApiController extends Controller {
 public function register(Request $r){
  $data=$r->validate(['name'=>'required|string|max:100','email'=>'required|email|unique:users,email','password'=>'required|string|min:8|confirmed']);
  $user=User::create([...$data,'role'=>'member']);
  return response()->json(['user'=>$user,'token'=>$user->createToken('web')->plainTextToken],201);
 }
 public function login(Request $r){
  $data=$r->validate(['email'=>'required|email','password'=>'required|string']);
  $user=User::where('email',$data['email'])->first();
  if(!$user || !Hash::check($data['password'],$user->password)) return response()->json(['message'=>'Email or password is incorrect'],422);
  return response()->json(['user'=>$user,'token'=>$user->createToken('web')->plainTextToken]);
 }
 public function me(Request $r){return response()->json($r->user());}
 public function logout(Request $r){$r->user()->currentAccessToken()?->delete();return response()->json(['message'=>'Logged out']);}
 public function categories(){return FoodCategory::orderBy('name')->get();}
 public function posts(Request $r){
  $q=FoodPost::with(['user:id,name','category:id,name'])->withCount(['likes','comments','bookmarks'])->where('status','published');
  if($r->filled('search'))$q->where(fn($x)=>$x->where('title','like','%'.$r->search.'%')->orWhere('description','like','%'.$r->search.'%')->orWhere('ingredients','like','%'.$r->search.'%'));
  if($r->filled('category'))$q->where('category_id',$r->category);
  if($r->boolean('mine'))$q->where('user_id',$r->user()->id);
  return $q->latest()->paginate(12);
 }
 public function showPost(FoodPost $post){return $post->load(['user:id,name','category','comments.user:id,name','ratings.user:id,name'])->loadCount(['likes','comments']);}
 public function createPost(Request $r){
  $d=$r->validate(['category_id'=>'required|exists:food_categories,id','title'=>'required|string|max:180','description'=>'required|string','image'=>'nullable|image|max:4096','ingredients'=>'nullable|string','instructions'=>'nullable|string','prep_minutes'=>'nullable|integer|min:0','cook_minutes'=>'nullable|integer|min:0','servings'=>'nullable|integer|min:1','calories'=>'nullable|numeric|min:0','protein'=>'nullable|numeric|min:0','carbs'=>'nullable|numeric|min:0','fat'=>'nullable|numeric|min:0']);
  if($r->hasFile('image'))$d['image']=$r->file('image')->store('food-posts','public');
  $d['user_id']=$r->user()->id;$d['status']='published';
  return response()->json(FoodPost::create($d)->load(['user','category']),201);
 }
 public function updatePost(Request $r,FoodPost $post){
  if($r->user()->role!=='admin' && $post->user_id!==$r->user()->id)return response()->json(['message'=>'Not allowed'],403);
  $d=$r->validate(['category_id'=>'sometimes|exists:food_categories,id','title'=>'sometimes|string|max:180','description'=>'sometimes|string','image'=>'nullable|image|max:4096','ingredients'=>'nullable|string','instructions'=>'nullable|string','prep_minutes'=>'nullable|integer|min:0','cook_minutes'=>'nullable|integer|min:0','servings'=>'nullable|integer|min:1','calories'=>'nullable|numeric|min:0','protein'=>'nullable|numeric|min:0','carbs'=>'nullable|numeric|min:0','fat'=>'nullable|numeric|min:0']);
  if($r->hasFile('image'))$d['image']=$r->file('image')->store('food-posts','public');
  $post->update($d);return $post->fresh()->load(['user','category']);
 }
 public function deletePost(Request $r,FoodPost $post){if($r->user()->role!=='admin'&&$post->user_id!==$r->user()->id)return response()->json(['message'=>'Not allowed'],403);$post->delete();return response()->json(['message'=>'Post deleted']);}
 public function toggleLike(Request $r,FoodPost $post){$x=Like::where(['user_id'=>$r->user()->id,'food_post_id'=>$post->id])->first();if($x){$x->delete();$liked=false;}else{Like::create(['user_id'=>$r->user()->id,'food_post_id'=>$post->id]);$liked=true;}return response()->json(['liked'=>$liked,'count'=>$post->likes()->count()]);}
 public function toggleBookmark(Request $r,FoodPost $post){$x=Bookmark::where(['user_id'=>$r->user()->id,'food_post_id'=>$post->id])->first();if($x){$x->delete();$saved=false;}else{Bookmark::create(['user_id'=>$r->user()->id,'food_post_id'=>$post->id]);$saved=true;}return response()->json(['saved'=>$saved]);}
 public function myBookmarks(Request $r){return FoodPost::with(['user:id,name','category'])->whereHas('bookmarks',fn($q)=>$q->where('user_id',$r->user()->id))->latest()->get();}
 public function comment(Request $r,FoodPost $post){$d=$r->validate(['body'=>'required|string|max:2000']);return response()->json($post->comments()->create(['user_id'=>$r->user()->id,'body'=>$d['body']])->load('user:id,name'),201);}
 public function rate(Request $r,FoodPost $post){$d=$r->validate(['rating'=>'required|integer|min:1|max:5','review'=>'nullable|string|max:1000']);$x=Rating::updateOrCreate(['user_id'=>$r->user()->id,'food_post_id'=>$post->id],$d);return response()->json($x);}
 public function report(Request $r,FoodPost $post){$d=$r->validate(['reason'=>'required|string|max:1000']);return response()->json(Report::create(['user_id'=>$r->user()->id,'food_post_id'=>$post->id,'reason'=>$d['reason'],'status'=>'pending']),201);}
 public function adminStats(){return response()->json(['users'=>User::count(),'posts'=>FoodPost::count(),'categories'=>FoodCategory::count(),'reports'=>Report::where('status','pending')->count()]);}
 public function adminUsers(){return User::select('id','name','email','role','created_at')->latest()->paginate(20);}
 public function adminReports(){return Report::with(['user:id,name','post:id,title'])->latest()->paginate(20);}
 public function resolveReport(Report $report){$report->update(['status'=>'resolved']);return response()->json($report);}
 public function adminCategories(){return FoodCategory::withCount('posts')->orderBy('name')->get();}
 public function createCategory(Request $r){$d=$r->validate(['name'=>'required|string|max:80|unique:food_categories,name','description'=>'nullable|string']);$d['slug']=\Illuminate\Support\Str::slug($d['name']);return response()->json(FoodCategory::create($d),201);}
 public function deleteCategory(FoodCategory $category){$category->delete();return response()->json(['message'=>'Category deleted']);}
}
