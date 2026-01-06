<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserPostRequest;
use App\Http\Resources\UserPostsResource;
use App\Models\PostLikes;
use App\Models\UserPosts;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $user_id=null)
    {
        $userId = $request->user()->id;

        $posts = UserPosts::with([
            'user',
            'comment' => function ($q) {
                $q->with(['user', 'commentLikes'])->whereNull('parent_id')->withCount(['replies as comment_replies_count'])
                    ->orderBy('create_time', 'desc');
            },
            'postLikes' => function ($q) use ($userId) {
                $q->where('user_id', $userId)
                    ->select(['id', 'post_id', 'user_id']);
            }
        ])->orderBy('create_time', 'desc');

        if(!empty($user_id)){
            $posts->where('user_id', $user_id);
        }
        $posts = $posts->paginate(10);

        return UserPostsResource::collection($posts);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserPostRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();
        $post = UserPosts::create([
            'user_id'=>$user->id,
            'post_content'=>json_encode($data['post_content']),
            'create_time'=>time(),
            'update_time'=>time(),
        ]);

        return new UserPostsResource($post);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserPostRequest $request, $id)
    {
        $data = $request->validated();
        $post = UserPosts::find($id);
        if($post){
            $post->post_content = $data['post_content'];
            $post->save();


            return new UserPostsResource($post);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        UserPosts::destroy($id);

        return response(null, 200);
    }

    public function likePost($id, Request $request){
        $user_id = $request->user()->id;
        $like = PostLikes::create([
            'post_id'=>$id,
            'user_id'=>$user_id
        ]);

        return response(['data'=>$like], 200);
    }

    public function deleteLikePost($id){
        $isDeleted = PostLikes::destroy($id);

        return response(['isDeleted'=>$isDeleted], 200);
    }
}
