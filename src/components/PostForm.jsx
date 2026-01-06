import axiosClient from "../axiosClient.js";
import {useState, useRef} from "react";
import {ClipLoader} from "react-spinners";
export default function PostForm({onCreated, postId, onUpdated, onCancel, currentContent, classNames=""}){
    const textPostRef = useRef()
    const [loading, setLoading] = useState(false)
    const postSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const payload = {
            post_content: {
                text: textPostRef.current.value
            }
        }
        
        const method = postId && onUpdated ? "put": "post";
        axiosClient[method](`/post/${postId && onUpdated ? postId : "create"}`, payload).then(({data}) => {
            const userPost = data.data;
            if(postId && onUpdated){
                onUpdated(userPost)
            }
            else{
                onCreated?.(userPost)
            }
            textPostRef.current.value = "";
        }).finally(()=>{
            setLoading(false)
        })
    }
    return (
        <div>
            <div className="wrapper">
                {
                    loading && (
                        <div className="minteract-spinner">
                            <ClipLoader color="gray" loading={loading} size={50} aria-label="Loading Spinner"/>
                        </div>
                    )
                }
                <form className={classNames} onSubmit={postSubmit}>
                    <textarea ref={textPostRef} placeholder="What is on your mind? Share it now." rows="5">{currentContent}</textarea>
                    <div className="minteract-btn-right mt-1">
                        { onUpdated && <button className="btn btn-gradient-default" type="button" onClick={onCancel}>Cancel</button> }
                        <button className="btn btn-purple">{onUpdated ? "Update": "Post"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}