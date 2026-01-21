<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PointOfInterest extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'points_of_interests';

    protected $fillable = [
        'name',
        'description',
        'latitude',
        'longitude',
    ];
}
