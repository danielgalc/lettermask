<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'edition_id',
        'name',
        'letter',
        'costume_name',
        'reveal_status',
    ];

    protected function casts(): array
    {
        return [
            'reveal_status' => 'string',
        ];
    }

    public function edition()
    {
        return $this->belongsTo(Edition::class);
    }

    public function participations()
    {
        return $this->hasMany(Participation::class);
    }

    public function members()
    {
        return $this->hasManyThrough(User::class, Participation::class, 'group_id', 'id', 'id', 'user_id');
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function leader()
    {
        return $this->participations()->where('is_leader', true)->first()?->user;
    }

    public function isComplete(): bool
    {
        return $this->participations()->count() === $this->edition->group_size;
    }

    public function allMembersReady(): bool
    {
        return $this->participations()->where('individual_ready', false)->doesntExist();
    }
}