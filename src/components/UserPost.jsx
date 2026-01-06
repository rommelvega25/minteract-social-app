import defaultAvatar from "../assets/images/default-avatar.jpg"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faComment, faShareFromSquare} from "@fortawesome/free-regular-svg-icons";
import {faEllipsis, faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom"
import {useState, useRef} from "react"
import axiosClient from "../axiosClient.js";
import {ClipLoader} from "react-spinners";
import CommentForm from "./CommentForm.jsx";
import CommentList from "./CommentList.jsx";
import {useAlert} from "../contexts/AlertProvider.jsx";
import PostForm from "./PostForm.jsx";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function UserPost({postData, onDelete, onUpdate}){
    const {user} = useStateContext()
    const post_id = postData.id;
    const postContent = JSON.parse(postData.post_content);
    const postText = postContent.text;
    const poster = postData.user

    const [expanded, setExpanded] = useState(false)
    const isLong = postText.length > 500
    const textToShow = expanded || !isLong ? postText: postText.substring(0,500)
    
    const [expandActions, setExpandActions] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const [liked, setLiked] = useState(postData.is_liked)
    const [likeId, setLikeId] = useState(postData.post_like_id)
    
    const [comments, setComments] = useState(postData.comments);
    
    const [editing, setEditing] = useState(false)
    
    const {showPrompt} = useAlert()
    
    const handleLike = () => {
        if(liked){
            setLiked(false)
            axiosClient.delete(`/post/like/${likeId}`).then(({data})=>{
                
            })
        }
        else{
            setLiked(true)
            axiosClient.post(`/post/${post_id}/like`).then(({data})=>{
                const id = data.data.id;
                setLikeId(id)
            })
        }
    }
    
    const deletePost = () => {
        showPrompt({
            message: "Are you sure you want to delete this post?",
            confirmText: 'Yes',
            cancelText: 'No',
            onConfirm: () => {
                setLoading(true)
                axiosClient.delete(`/post/${post_id}`).then(({data}) => {
                    onDelete(post_id)
                    setExpandActions(false)
                }).finally(() => {
                    setLoading(false)
                })
            }
        })
    }

    const handleDeleteComment = (commentId) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
    };
    
    const textAreaRef = useRef()
    
    return (
        <div className="wrapper">
            {
                loading && (
                    <div className="minteract-spinner">
                        <ClipLoader color="gray" loading={loading} size={50} aria-label="Loading Spinner"/>
                    </div>
                )
            }
            <div className="user-post">
                <div className="header">
                    <div className="user-profile">
                        <div>
                            <img src={poster.avatar_url ?? defaultAvatar}/>
                        </div>
                        <div className="user-name">
                            <Link>{poster.first_name} {poster.last_name}</Link>
                        </div>
                    </div>
                    <div className="actions">
                        <button onClick={() => setExpandActions((v) => !v)}>
                            <FontAwesomeIcon icon={faEllipsis}/>
                        </button>
                        {expandActions && (
                            <div className="dropdown-menu">
                                <ul>
                                    {
                                        postData.user.id === user.id && (
                                            <>
                                                <li>
                                                    <button onClick={() => {
                                                        setEditing(true)
                                                        setExpandActions(false)
                                                    }}>
                                                        Edit
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={() => {
                                                        deletePost()
                                                    }}>Delete
                                                    </button>
                                                </li>
                                            </>
                                        )
                                    }

                                    {
                                        postData.user.id !== user.id && <li>
                                            <button>Report</button>
                                        </li>
                                    }
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="body">
                    {!editing && textToShow}
                    {
                        editing && (
                            <PostForm classNames="fcy-form font-09 mt-5 mb-5" postId={post_id} onUpdated={(updatedPost) => {
                                onUpdate?.(updatedPost)
                                setEditing(false)
                            }} currentContent={postText} onCancel={() => {
                                setEditing(false)
                            }}/>
                        )
                    }
                    {!expanded && isLong && "...  "}
                    {
                        isLong && (
                            <span className="clickable" onClick={() => setExpanded((v) => !v)}>{expanded ? "  See Less" : "See More"}</span>
                        )
                    }
                </div>
                <div className="footer">
                    <button onClick={()=>{handleLike(post_id)}}>
                        <FontAwesomeIcon className={liked ? "hasLiked": ""} icon={liked ? faHeartSolid : faHeart}/>
                    </button>
                    <button>
                        <FontAwesomeIcon icon={faComment} onClick={()=>{textAreaRef.current?.focus()}}/>
                    </button>
                    <button>
                        <FontAwesomeIcon icon={faShareFromSquare}/>
                    </button>
                </div>
                <div className="comment-section">
                    <CommentForm ref={textAreaRef} postId={post_id} handleComment={setComments} textplaceHolder="Enter your comment"/>
                    <CommentList comments={comments} onDelete={handleDeleteComment}/>
                </div>
            </div>
        </div>
    )
}