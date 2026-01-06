import PostForm from "../components/PostForm.jsx"
import PostsFeed from "../components/PostsFeed.jsx";
import {useRef} from "react";
export default function Home(){
    const feedRef = useRef()
    const handleCreated = (newPost) => {
        feedRef.current?.prependPost(newPost)
    }
    return (
        <div className="container timeline">
            <PostForm onCreated={handleCreated} classNames="fcy-form p-5"/>
            <PostsFeed ref={feedRef} classNames="w-90"/>
        </div>
    )
}