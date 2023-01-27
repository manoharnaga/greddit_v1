import { useState } from "react";
import { Navigate } from "react-router-dom";

const Profile = (props) => {
    const [display,setDisplay] = useState({
        Follower: "none",
        Following: "none"
    });

    const [followerList,setFollowers] = useState([
        { id: 1, username: 'manohar_21' },
        { id: 2, username: 'chromastone' },
        { id: 3, username: 'john_doe' },
      ]
    );

    const [followingList,setFollowing] = useState([
        { id: 1, username: 'avatar_aang' },
        { id: 2, username: 'teen_titans' },
        { id: 3, username: 'shinchan' },
      ]
    );
    console.log(props.Loginval);
    if(props.Loginval === "false"){
        return <Navigate to="/login" />;
    }
    
    
    const removeFollower = (id) => {
        setFollowers(followerList.filter(
            (follower) => {return (follower.id !== id);}));
        }
        
    const removeFollowing = (id) => {
        setFollowing(followingList.filter(
            (following) => {return (following.id !== id);}));
        }
        
    console.log("Helo");
    return (
        <div>
            <h1>Helo @{props.userData.username}</h1>
            <table>
                <tbody>
                    {/* <th>My Profile</th> */}
                    <tr>
                        <td>First Name: </td>
                        <td>{props.userData.fname}</td>
                    </tr>
                    <tr>
                        <td>Last Name: </td>
                        <td>{props.userData.lname}</td>
                    </tr>
                    <tr>
                        <td>User Name: </td>
                        <td>{props.userData.username}</td>
                    </tr>
                    <tr>
                        <td>Email id: </td>
                        <td>{props.userData.emailid}</td>
                    </tr>
                    <tr>
                        <td>Age: </td>
                        <td>{props.userData.age}</td>
                    </tr>
                    <tr>
                        <td>Phone No: </td>
                        <td>{props.userData.phno}</td>
                    </tr>
                    <tr>
                        <td>
                            <button className="btn btn-lg btn-info" onClick={() => {setDisplay({Follower:"",Following:"none"})}}>Followers {followerList.length}</button>
                        </td>
                        <td>
                            <button className="btn btn-lg btn-info" onClick={() => {setDisplay({Follower:"none",Following:""})}}>Following {followingList.length}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            

            <table style={{display:display.Follower}}>
                <tbody>
                    {followerList.map((follower) => (
                        <tr key={follower.id}>
                            <td>{follower.username}</td>
                            <td>
                            <button onClick={() => { return removeFollower(follower.id);}} className="btn btn-lg btn-secondary">Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table style={{display:display.Following}}>
                <tbody>
                    {followingList.map((following) => (
                        <tr key={following.id}>
                            <td>{following.username}</td>
                            <td>
                            <button onClick={() => { return removeFollowing(following.id);}} className="btn btn-lg btn-secondary">Unfollow</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default Profile;