import PostForm from "../components/PostForm.jsx";
import PostFeed from "../components/PostsFeed.jsx";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {Navigate} from "react-router-dom";

export default function Profile(){
    const {user, token} = useStateContext()
    if(!token){
        return <Navigate to="/login" />
    }
    return (
        <div>
            <div className="container timeline">
                <PostForm classNames="fcy-form p-5"/>
                <PostFeed userId={user.id}/>
            </div>
        </div>
    )
}