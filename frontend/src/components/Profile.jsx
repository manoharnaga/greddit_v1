import { useState } from "react";
import { Navigate } from "react-router-dom";

const Profile = (props) => {
    const [display,setDisplay] = useState({
        Follower: "none",
        Following: "none"
    });
    const [EditProfile,setEditProfile] = useState("");

    if(props.Loginval === "false"){
        return <Navigate to="/login" />;
    }
    
    const removeFollow = (username,followerUsername,flagFollow) => {
        fetch(`http://localhost:5000/profile/followers`, {
        method: 'PUT',
        crossDomain: true,
        body: JSON.stringify({username:username,followerUsername:followerUsername,flagFollow:flagFollow}),
        headers: {
            'Content-Type': 'application/json',
            Accept:"application/json",
            "Access-Control-Allow-Origin": "*",
        }
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === "both recieved"){
                console.log("both recieved",data);
                const userdata = data.firstResponse;
                props.setUserData(userdata);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    return (
        (EditProfile === "openEditProfilePage") ?
        <Navigate to="/editprofile"/>
        :
        <div>
            <h1>Helo @{props.userData.username}</h1>
            <table>
                <tbody>
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
                    <tr colSpan="2">
                        <td>
                            <button className="btn btn-lg btn-info" onClick={
                                () => {
                                    setEditProfile("openEditProfilePage");
                                }
                                }>Edit Profile</button>
                        </td>
                    </tr>
                    <tr colSpan="2">
                        <td>
                            {EditProfile}   
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button className="btn btn-lg btn-info" onClick={() => {setDisplay({Follower:"",Following:"none"})}}>Followers {props.userData.followers?.length}</button>
                        </td>
                        <td>
                            <button className="btn btn-lg btn-info" onClick={() => {setDisplay({Follower:"none",Following:""})}}>Following {props.userData.following?.length}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            

            <table style={{display:display.Follower}}>
                <tbody>
                    {props.userData.followers?.map((follower) => (
                        <tr key={follower.id}>
                            <td>{follower.username}</td>
                            <td>
                                <button onClick={() => {removeFollow(props.userData.username,follower.username,1);}} className="btn btn-lg btn-secondary">Remove</button>
                            </td>
                        </tr>
                        ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <button className="btn btn-lg btn-secondary" onClick={() => {setDisplay({Follower:"none",Following:"none"})}}>close</button>
                        </td>
                    </tr>
                </tfoot>
            </table>

            <table style={{display:display.Following}}>
                <tbody>
                    {props.userData.following?.map((following) => (
                        <tr key={following.id}>
                            <td>{following.username}</td>
                            <td>
                            <button onClick={() => {
                                removeFollow(props.userData.username,following.username,2);
                            }} 
                                className="btn btn-lg btn-secondary">Unfollow</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <button className="btn btn-lg btn-secondary" onClick={() => {setDisplay({Follower:"none",Following:"none"})}}>close</button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
}

export default Profile;