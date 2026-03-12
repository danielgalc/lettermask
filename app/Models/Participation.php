<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'group_id',
        'individual_ready',
        'is_leader',
    ];

    protected function casts(): array
    {
        return [
            'individual_ready' => 'boolean',
            'is_leader' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}