import {useSearchParams} from "react-router-dom"
import axiosClient from "../axiosClient.js"
import {useEffect, useState} from "react";
import ProfileResult from "../components/ProfileResult.jsx";
import {ClipLoader} from "react-spinners";
import Skeleton from "react-loading-skeleton";
export default function Search(){
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false)
    const query = searchParams.get("q");

    useEffect(() => {
        const payload = {
            keyword: query
        }
        if(query){
            setLoading(true)
            axiosClient.post('/user/search', payload).then(({data})=>{
                setSearchResults(data.data)
                setLoading(false)
            })
        }
    }, [query]);
    
    return (
        <div className="container timeline">
            {
                loading && (
                    <div className="skeleton-loading">
                        <div className="card-skeleton">
                            <h3><Skeleton/></h3>
                            <p><Skeleton count={2}/></p>
                        </div>
                    </div>
                )
            }
            {
                searchResults && !loading && searchResults.map(user=>{
                    return <ProfileResult user={user} />
                })
            }
        </div>
    )
}