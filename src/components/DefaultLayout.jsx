import {useStateContext} from "../contexts/ContextProvider.jsx";
import {Link, Navigate, Outlet, useNavigate} from "react-router-dom"
import {useEffect, useRef, useState} from "react"
import axiosClient from "../axiosClient.js";
import defaultAvatar from "../assets/images/default-avatar.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMessage, faBell} from "@fortawesome/free-solid-svg-icons";

export default function DefaultLayout(){
    const {user, token, setUser, setToken} = useStateContext()
    if(!token){
        return <Navigate to="/login" />
    }

    useEffect(() => {
        axiosClient.get('/user').then(({data}) => {
            setUser(data)
        })
    }, []);
    
    const [showDropdown, setShowDropdown] = useState(false)
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const onLogout = (e) =>{
        e.preventDefault();
        axiosClient.post("/logout").then(() => {
            setUser({})
            setToken(null)
        });
    }
    
    const searchTextRef = useRef()
    const navigate = useNavigate();

    const triggerSearch = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const q = searchTextRef.current.value.trim();
            if(!q) return;

            navigate(`/search?q=${encodeURIComponent(q)}`);
        }
    };
    
    return (
        <div id="authenticatedLayout">
            <div className="content">
                <header>
                    <div className="nav-wrapper">
                        <div className="top-navbar mb-2">
                            <div className="left-area">
                                <Link to="/home">
                                    <div className="minteract-logo">
                                        <h1>MiA</h1>
                                    </div>
                                </Link>
                                <div className="search-bar-w">
                                    <input ref={searchTextRef} onKeyDown={triggerSearch} type="text" placeholder="Search people"/>
                                </div>
                            </div>
                        </div>
                        <div className="top-navbar">
                            <div className="left-area">
                                <Link to="/home">
                                    <div className="minteract-logo">
                                        <h1>MiA</h1>
                                    </div>
                                </Link>
                                <div className="search-bar-w">
                                    <input ref={searchTextRef} onKeyDown={triggerSearch} type="text" placeholder="Search people"/>
                                </div>
                            </div>
                            <div className="actions-w">
                                <Link id="homeBtn" to="/home">
                                    <FontAwesomeIcon icon={faHouse} size="lg" className="text-purple"/>
                                </Link>
                            </div>
                            <div className="right-actions-w">
                            <span className="action clickable">
                                <FontAwesomeIcon icon={faMessage} size="lg" className="text-purple"/>
                            </span>
                                <span className="action clickable">
                                <FontAwesomeIcon icon={faBell} size="lg" className="text-purple"/>
                            </span>
                                <div className="profile-right-actions">
                                    <button type="button" onClick={toggleDropdown}>
                                        <img className="avatar" src={user.avatar_url ?? defaultAvatar}/>
                                    </button>
                                    {
                                        showDropdown && (
                                            <div className="dropdown-menu">
                                                <ul>
                                                    <li>
                                                        <Link to="/profile">
                                                            Profile
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <button onClick={onLogout}>
                                                            Logout
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </header>
                <main>
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}