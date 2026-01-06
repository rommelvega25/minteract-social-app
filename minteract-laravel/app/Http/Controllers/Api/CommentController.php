<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\CommentLikes;
use App\Models\Comments;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(CommentRequest $request, $id){
        $data = $request->validated();
        $comment = Comments::create([
            'post_id'=>$id,
            'comment_content' => $data['comment_content'],
            'user_id' => $request->user()->id,
            'create_time'=>time(),
            'update_time'=>time()
        ]);

        $comment->load('user');
        return response(compact( 'comment'));
    }

    public function destroy($id){
        $isDeleted = Comments::destroy($id);

        return response(['isDeleted'=>$isDeleted]);
    }

    public function likeComment($comment_id, Request $request){
        $commentLike = CommentLikes::create([
            'comment_id'=>$comment_id,
            'user_id'=>$request->user()->id
        ]);

        return response(compact( 'commentLike'));
    }

    public function removeLike($like_id){
        $isDeleted = CommentLikes::destroy($like_id);

        return response(['isDeleted'=>$isDeleted]);
    }

    public function replyComment(CommentRequest $request, $comment_id){
        $data = $request->validated();
        $commentReply = Comments::create([
            'parent_id'=>$comment_id,
            'post_id'=>$data['post_id'],
            'user_id'=>$request->user()->id,
            'comment_content' => $data['comment_content'],
            'create_time'=>time(),
            'update_time'=>time()
        ]);

        $commentReply->load('user');

        return response(['commentReply'=>$commentReply]);
    }

    public function getCommentReplies($comment_id){
        $replies = Comments::where('parent_id', $comment_id)
            ->with('user')
            ->limit(10)
            ->orderBy('create_time', 'desc')
            ->get();

        return CommentResource::collection($replies);
    }
}
