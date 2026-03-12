<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'edition_id',
        'name',
    ];

    public function edition()
    {
        return $this->belongsTo(Edition::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}