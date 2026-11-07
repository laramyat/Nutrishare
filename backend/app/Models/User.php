<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'is_banned',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_banned' => 'boolean',
        ];
    }

    // User Food Posts
    public function posts()
    {
        return $this->hasMany(FoodPost::class);
    }

    // User Comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Check Admin
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // Check Banned User
    public function isBanned(): bool
    {
        return (bool) $this->is_banned;
    }
}