import Comment from "../components/Comment.jsx"
export default function CommentList({comments, onDelete, onDeleteReply}){
    return (
        <div>
            {
                comments.map(commentData => {
                    return <Comment commentData={commentData} onDelete={onDelete} onDeleteReply={onDeleteReply}/>
                })
            }
        </div>
    )
}