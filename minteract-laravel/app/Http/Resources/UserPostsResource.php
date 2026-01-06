<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserPostsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id'=>$this->id,
            'user'=>[
                'id'=>$this->user->id,
                'first_name'=>$this->user->first_name,
                'last_name'=>$this->user->last_name,
                'email'=>$this->user->email,
            ],
            'post_content'=>is_string($this->post_content) ? $this->post_content : json_encode($this->post_content),
            'create_time'=>$this->create_time,
            'update_time'=>$this->update_time,
            'is_liked' => $this->relationLoaded('postLikes') && $this->postLikes->isNotEmpty(),
            'post_like_id' => $this->relationLoaded('postLikes') ? optional($this->postLikes->first())->id : null,
            'comments'=>CommentResource::collection(
                $this->whenLoaded('comment')
            )
        ];
    }
}
