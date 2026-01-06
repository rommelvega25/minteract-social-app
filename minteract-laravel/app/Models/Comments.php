<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comments extends Model
{
    use HasFactory;
    protected $fillable = [
        'post_id',
        'user_id',
        'parent_id',
        'comment_content',
        'create_time',
        'update_time'
    ];
    protected $primaryKey = "id";
    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function commentLikes(){
        return $this->hasMany(CommentLikes::class, 'comment_id', 'id');
    }

    public function replies(){
        return $this->hasMany(self::class, 'parent_id', 'id');
    }
}
