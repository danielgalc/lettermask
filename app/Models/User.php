<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
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
            'role' => 'string',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function participations()
    {
        return $this->hasMany(Participation::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function editions()
    {
        return $this->hasManyThrough(Edition::class, Participation::class, 'user_id', 'id', 'id', 'edition_id');
    }
}