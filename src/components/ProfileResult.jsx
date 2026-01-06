import defaultAvatar from "../assets/images/default-avatar.jpg"
import {Link, useNavigate} from "react-router-dom"
export default function ProfileResult({user}){
    return (
        <div className="profile-result">
            <div className="header">
                <div className="user-profile">
                    <img src={user.avatar_url ? user.avatar_url : defaultAvatar}/>
                    <Link to={`/profile/${user.id}`}>{user.first_name} {user.last_name}</Link>
                </div>
                <div className="footer">
                    <Link to={`/profile/${user.id}`} className="btn btn-purple">View Profile</Link>
                </div>
            </div>

        </div>
    )
}