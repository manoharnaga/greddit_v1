import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Navbar"


const EditProfile = (props) => {
    const [ProfileData, setProfileData] = useState({
        prevUsername: props.userData.username,
        prevPassword: props.userData.password,
        fname: props.userData.fname,
        lname: props.userData.lname,
        username: props.userData.username,
        emailid: props.userData.emailid,
        age: props.userData.age,
        phno: props.userData.phno,
        password: props.userData.password
    });

    // const [EditProfile,setEditProfile] = useState("openEditProfilePage");
    const [EditProfileDisabled, setEditProfileDisabled] = useState(false);
    let navigate = useNavigate();


    if(props.Loginval === "false"){
        return <Navigate to="/login" />;
    }

    const handleEditProfileChange = (e) => {
        // console.log(e.target.value);
        setProfileData({
            ...ProfileData,
            [e.target.name]: e.target.value
        });
        
        let checkEditProfile = 1;
        for(const key in ProfileData){
            if(key !== e.target.name){
                checkEditProfile = checkEditProfile && (ProfileData[key].length > 0);
            }
        }
        setEditProfileDisabled(!(checkEditProfile && (e.target.value.length > 0)));
    }

    const handleEditProfile = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:7000/profile/editprofile`, {
        method: 'PUT',
        crossDomain: true,
        body: JSON.stringify(ProfileData),
        headers: {
            'Content-Type': 'application/json',
            Accept:"application/json",
            "Access-Control-Allow-Origin": "*",
        }
        })
        .then(res => res.json())
        .then(data => {
            console.log("profile edited",data);
            if(data.status === "profile edited"){
                const userdata = data.data;
                if(data.Changedlogin !== "no"){
                    console.log("changed");
                    // localStorage.setItem("username", JSON.stringify(userdata.username));
                    // localStorage.setItem("password", JSON.stringify(userdata.password));
                    props.Loginfunc("false");
                }
                else{
                    props.setUserData(userdata);
                    navigate("/profile",{state:{editprofile:'successfull'}});
                    // setEditProfile("Profile Updated Successfully!");//green
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // setEditProfile("Error in Updating Profile!");//green
        });
    }

    return (
        <div>
            <Navbar Loginval={props.Loginval}
              Loginfunc={props.Loginfunc}
              userData={props.userData}
              setUserData={props.setUserData}/>
            <h1>Edit Profile</h1>
            <div>
                <form onSubmit={handleEditProfile}>
                    <input onChange={handleEditProfileChange} value={ProfileData.fname}type="text" name="fname" placeholder="First Name" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.lname} type="text" name="lname" placeholder="Last Name" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.username} type="text" name="username" placeholder="User Name" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.emailid} type="email" name="emailid" placeholder="Email Id" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.age} type="number" name="age" placeholder="Age" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.phno} type="tel" name="phno" placeholder="Phone Number" className="form-control" />
                    <input onChange={handleEditProfileChange} type="password" name="password" placeholder="New/Old Password" className="form-control" />
                    <button type="submit" className="btn btn-lg btn-primary">
                    Submit Profile
                    </button>
                    <button onClick={() => {
                            navigate("/profile");
                        }
                    }>
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
}
export default EditProfile;