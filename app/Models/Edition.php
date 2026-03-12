<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Edition extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'theme',
        'participation_mode',
        'group_size',
        'status',
        'event_date',
        'use_letters',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'use_letters' => 'boolean',
            'group_size' => 'integer',
        ];
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function isIndividual(): bool
    {
        return $this->participation_mode === 'individual';
    }

    public function usesLetters(): bool
    {
        return $this->use_letters && $this->isIndividual();
    }
}