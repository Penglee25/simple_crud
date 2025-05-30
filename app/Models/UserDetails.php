<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDetails extends Model
{
    protected $table = "user_details";
      protected $fillable = [
        'name',
        'email',
        'phone',
        'address'
    ];
}
