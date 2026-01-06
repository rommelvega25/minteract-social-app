import PostForm from "./PostForm.jsx";
import UserPost from "./UserPost.jsx";
import {useEffect, useState, forwardRef, useImperativeHandle} from "react";
import axiosClient from "../axiosClient.js";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PostFeed = forwardRef(function PostFeed({userId, classNames}, ref){
    const classes = `${classNames} card-skeleton`.trim();
    const [userPosts, setUserPosts] = useState(null)
    const [loading, setLoading] = useState(false)
    const handleDelete = (postId) => {
        setUserPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    const handlePostUpdated = (updatedPost) => {
        setUserPosts(prev =>
            prev.map(post =>
                post.id === updatedPost.id
                    ? {
                        ...post,
                        post_content: updatedPost.post_content,
                        updated_at: updatedPost.updated_at ?? post.updated_at,
                    }
                    : post
            )
        );
    }
    
    const fetchPosts = () => {
        axiosClient.get("/posts"+(userId ? `/${userId}`: "")).then(({data})=>{
            const userPosts = data.data;
            if(userPosts){
                setUserPosts(userPosts)
            }
        }).finally(() => {
            setLoading(false)
        })
    }
    
    
    useImperativeHandle(ref, ()=> ({
        prependPost(newPost){
            setUserPosts((prev) => [newPost, ...prev])
        },
        refresh() {
            fetchPosts()
        }
    }))

    useEffect(() => {
        setLoading(true)
        fetchPosts()
    }, []);
    return (
        <div>
            {
                loading && (
                    <div className="skeleton-loading">
                        {Array.from({length:3}).map((_, idx) => (
                            <div className={classes}>
                                <h3><Skeleton/></h3>
                                <p><Skeleton count={2}/></p>
                            </div>
                        ))}
                    </div>
                )
            }
            {
                !loading && userPosts && userPosts.map(p => {
                    return <UserPost postData={p} onDelete={handleDelete} onUpdate={handlePostUpdated}/>
                })
            }
        </div>
    )
})

export default PostFeed;