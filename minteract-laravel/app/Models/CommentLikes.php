<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentLikes extends Model
{
    use HasFactory;
    protected $fillable = [
        'comment_id',
        'user_id',
        'created_at',
        'updated_at'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function comment(){
       return $this->belongsTo(Comments::class, 'comment_id', 'id');
    }
}
