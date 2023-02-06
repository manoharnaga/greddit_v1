import { useState } from "react";
import { Navigate } from "react-router-dom";


const EditProfile = (props) => {
    const [ProfileData, setProfileData] = useState({
        fname: "dsf",
        lname: "sdfafs",
        username: "",
        emailid: "",
        age: "",
        phno: "",
        password: "",
        followers: [
          { id: 1, username: 'abc' },
          { id: 2, username: 'abc1' },
          { id: 3, username: 'abc2' },
          { id: 4, username: 'abc3' }, 
        ],
        following: [
          { id: 1, username: 'abc' },
          { id: 2, username: 'abc1' },
          { id: 3, username: 'abc2' },
          { id: 4, username: 'abc3' },
        ]
    });

    const [EditProfile,setEditProfile] = useState("openEditProfilePage");
    const [EditProfileDisabled, setEditProfileDisabled] = useState(1);

    if(props.Loginval === "false"){
        return <Navigate to="/login" />;
    }

    const handleEditProfileChange = (e) => {
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

    const handleEditProfile = async () => {
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
            if(data.status === "profile edited"){
                console.log("profile edited",data);
                const userdata = data.data;
                props.setUserData(userdata);
                // setEditProfile("Profile Updated Successfully!");//green
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // setEditProfile("Error in Updating Profile!");//green
        });
    }

    // return <h1>Hello</h1>;
    return (
        <div>
            <h1>Edit Profile</h1>
            {EditProfile==="openEditProfilePage"} ?
            <div>
                <form onSubmit={handleEditProfile}>
                    <input onChange={handleEditProfileChange} value={ProfileData.fname}type="text" name="fname" placeholder="First Name" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.lname} type="text" name="lname" placeholder="Last Name" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.username} type="text" name="username" placeholder="User Name" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.emailid} type="email" name="emailid" placeholder="Email Id" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.age} type="number" name="age" placeholder="Age" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.phno} type="tel" name="phno" placeholder="Phone Number" className="form-control" />
                    <input onChange={handleEditProfileChange} value={ProfileData.password} type="password" name="password" placeholder="Password" className="form-control" />
                    <button type="submit" className="btn btn-lg btn-primary" disabled={EditProfileDisabled}>
                    Submit Profile
                    </button>
                    <button onClick={() => {setEditProfile("closeEditProfilePage");}}>
                        Close
                    </button>
                </form>
            </div>
            :
            <Navigate to="/profile" />
        </div>
    );
}
export default EditProfile;