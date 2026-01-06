import {useStateContext} from "../contexts/ContextProvider.jsx";
import defaultAvatar from "../assets/images/default-avatar.jpg"
import {Navigate} from "react-router-dom";
import axiosClient from "../axiosClient.js";
import {forwardRef, useRef, useState} from "react";
import {ClipLoader} from "react-spinners";
import TextSubmitForm from "./TextSubmitForm.jsx";
const CommentForm = forwardRef(function CommentForm({postId, parentCommentId, handleComment, textplaceHolder}, ref){
    const {user} = useStateContext()
    const [loading, setLoading] = useState(false)
    
    const submitComment = async (text) => {
        setLoading(true)
        const payload = {
            user_id: user.id,
            comment_content: text
        }

        try {
            const { data } = await axiosClient.post(`/post/${postId}/comment`, payload);
            handleComment?.((prev) => [data.comment, ...prev]);
        } finally {
            setLoading(false);
        }
    }
    
    const submitReply = async (text) =>{
        setLoading(true)
        const payload = {
            comment_content: text,
            post_id: postId
        }

        try {
            const { data } = await axiosClient.post(`/comment/${parentCommentId}/reply`, payload);
            handleComment?.((prev) => [data.commentReply, ...prev]);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="wrapper">
            {
                loading && (
                    <div className="minteract-spinner">
                        <ClipLoader color="gray" loading={loading} size={50} aria-label="Loading Spinner"/>
                    </div>
                )
            }

            <div className="comment-form">
                <div className="user-profile">
                    <img src={user.avatar ?? defaultAvatar}/>
                </div>
                <TextSubmitForm onSubmit={parentCommentId ? submitReply: submitComment} ref={ref} placeholder={textplaceHolder} />
                
            </div>
        </div>
    )
})

export default CommentForm;