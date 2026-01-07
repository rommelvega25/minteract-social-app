import PostForm from "../components/PostForm.jsx";
import PostFeed from "../components/PostsFeed.jsx";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {Navigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axiosClient.js";

export default function Profile(){
    const {user, token} = useStateContext()
    const [userProfile, setUserProfile] = useState(null)
    if(!token){
        return <Navigate to="/login" />
    }
    const {id} = useParams()
    useEffect(() => {
        if (!id) return;

        axiosClient.get(`/user/${id}`).then(({ data }) => {
            setUserProfile(data.data);
        });
    }, [id]);
    
    
    useEffect(() => {
        if (id) return;

        setUserProfile(user);
    }, [id, user]);
    
    
    return (
        <div>
            <div className="container timeline">
                <PostForm classNames="fcy-form"/>
                {
                    userProfile?.id && <PostFeed userId={userProfile.id}/>
                }
            </div>
        </div>
    )
}