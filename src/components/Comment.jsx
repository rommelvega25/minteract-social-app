import {useStateContext} from "../contexts/ContextProvider.jsx";
import defaultAvatar from "../assets/images/default-avatar.jpg"
import {Link} from "react-router-dom";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import {faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react"
import axiosClient from "../axiosClient.js";
import {ClipLoader} from "react-spinners";
import { useAlert } from "../contexts/AlertProvider.jsx";
import CommentForm from "./CommentForm.jsx";
import CommentList from "./CommentList.jsx";

export default function Comment({commentData, onDelete, onDeleteReply}){
    const {user} = useStateContext()
    const commentId = commentData.id
    const parentCommentId = commentData.parent_id ?? commentId; 
    const isCommentReply = parentCommentId !== commentId;
    
    const postId = commentData.post_id;
    const commenter = commentData.user;
    const commentContent = commentData.comment_content;
    const isLong = commentContent.length > 300;
    const [expand, setExpand] = useState(false)
    const content = isLong ? commentContent.substring(0, 300)+"...": commentContent;
    const [loading, setLoading] = useState();
    
    const [likedComment, setLikedComment] = useState(commentData.is_liked)
    const [likedCommentId, setLikedCommentId] = useState(null)
    
    const [showReplyForm, setShowReplyForm] = useState(false)

    const { showPrompt } = useAlert();
    
    const [commentReplies, setCommentReplies] = useState([])
    const repliesCount = commentData.comment_replies_count
    
    const [loadingViewReplies, setLoadingViewReplies] = useState(false)
    
    const deleteComment = () => {
        showPrompt({
            message: `Are you sure you want to delete this ${isCommentReply ? "reply": "comment"}?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            onConfirm: async () => {
                setLoading(true);
                try {
                    await axiosClient.delete(`/comment/${commentId}`);
                    if (isCommentReply) {
                        onDeleteReply?.(commentId);
                    } else {
                        onDelete?.(commentId);
                    }
                } finally {
                    setLoading(false);
                }
            },
        });
    }
    
    const likeComment = () =>{
        if(!likedComment){
            setLikedComment(true)
            axiosClient.post(`/comment/${commentId}/like`, {user_id: user.id}).then(({data}) => {
                setLikedCommentId(data.commentLike.id)
            }).catch(() => {
                setLikedComment(false)
            })
        }
        else{
            setLikedComment(false)
            axiosClient.delete(`/comment/like/${likedCommentId}`).then(() => {

            })
        }
    }

    const handleDeleteReply = (deletedId) => {
        setCommentReplies(prev => prev.filter(r => r.id !== deletedId));
    };
    
    const viewReplies = () => {
        setLoadingViewReplies(true)
        axiosClient.get(`/comment/${commentId}/replies`).then(({data}) => {
            setCommentReplies(data.data)
        }).finally(()=>{
            setLoadingViewReplies(false)
        })
    }
    
    return (
        <div className="wrapper">
            {
                loading && <div className="minteract-spinner">
                    <ClipLoader color="gray" loading={loading} size={50} aria-label="Loading Spinner"/>
                </div>
            }
            <div className="comment">
                <div className="comment-header">
                    <div className="user-profile">
                    <img src={user.avatar ?? defaultAvatar}/>
                        <Link to="/profile">{commenter.first_name} {commenter.last_name}</Link>
                    </div>
                    <div className="comment-date">
                        {moment.unix(commentData.create_time).format("MMMM DD YYYY HH:mm:ss")}
                    </div>
                </div>
                <div className="comment-body">
                    <div className="comment-content">
                        <p>{expand ? commentContent : content}</p>
                        {isLong && <span className="clickable" onClick={() => setExpand(!expand)}>{expand ? "See Less" : "See more"}</span>}
                    </div>
                    <div className="comment-footer">
                        <button type="button" onClick={likeComment}>
                            <FontAwesomeIcon className={likedComment ? "hasLiked": ""} icon={likedComment ? faHeartSolid: faHeart}/>
                        </button>
                        <button type="button" onClick={()=>{setShowReplyForm(true)}}>
                            Reply
                        </button>
                        <button type="button" onClick={deleteComment}>
                            Delete
                        </button>
                    </div>
                    <div className="comment-replies">
                        {
                            showReplyForm && <CommentForm textplaceHolder="Enter your reply" handleComment={setCommentReplies} parentCommentId={parentCommentId} postId={postId}/>
                        }

                        <div className="comments-list mt-2">
                            <CommentList comments={commentReplies} onDeleteReply={handleDeleteReply}/>
                        </div>

                        {
                            repliesCount > 0 && (
                                <div className="reply-counter">
                                    <div className="wrapper">
                                        {
                                            loadingViewReplies && (
                                                <div className="minteract-spinner">
                                                    <ClipLoader color="gray" loading={loading} size={50}
                                                                aria-label="Loading Spinner"/>
                                                </div>
                                            )
                                        }
                                        <span onClick={viewReplies}
                                              className="clickable clickable-u">View {commentData.comment_replies_count} {repliesCount > 1 ? "replies" : "reply"}</span>
                                    </div>

                                </div>
                            )
                        }
                    </div>
                    
                </div>
            </div>
        </div>
    )
}