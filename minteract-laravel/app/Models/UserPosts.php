<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPosts extends Model
{
    use HasFactory;
    protected $table = "user_posts";
    protected $fillable = [
        "user_id",
        "post_content",
        "create_time",
        "update_time"
    ];
    public $timestamps = false;

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function postLikes()
    {
        return $this->hasMany(PostLikes::class, 'post_id', 'id');
    }

    public function comment(){
        return $this->hasMany(Comments::class, 'post_id', 'id');
    }
}
