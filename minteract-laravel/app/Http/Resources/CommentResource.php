<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
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
            'parent_id'=>$this->parent_id,
            'post_id'=>$this->post_id,
            'user'=>new UserResource(
                $this->whenLoaded('user')
            ),
            'comment_content'=>$this->comment_content,
            'create_time'=>$this->create_time,
            'update_time'=>$this->update_time,
            'is_liked'=>$this->relationLoaded('commentLikes') && $this->commentLikes->isNotEmpty(),
            'comment_liked_id'=>$this->relationLoaded('commentLikes') ? optional($this->commentLikes->first())->id : null,
            'comment_replies_count'=>$this->comment_replies_count
        ];
    }
}
