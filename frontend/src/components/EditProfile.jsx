import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

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
    password: props.userData.password,
  });

  // const [EditProfile,setEditProfile] = useState("openEditProfilePage");
  const [EditProfileDisabled, setEditProfileDisabled] = useState(false);
  let navigate = useNavigate();

  if (props.Loginval === "false") {
    return <Navigate to="/login" />;
  }

  const handleEditProfileChange = (e) => {
    // console.log(e.target.value);
    setProfileData({
      ...ProfileData,
      [e.target.name]: e.target.value,
    });

    let checkEditProfile = 1;
    for (const key in ProfileData) {
      if (key !== e.target.name) {
        checkEditProfile = checkEditProfile && ProfileData[key].length > 0;
      }
    }
    setEditProfileDisabled(!(checkEditProfile && e.target.value.length > 0));
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:7000/profile/editprofile`, {
      method: "PUT",
      crossDomain: true,
      body: JSON.stringify(ProfileData),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("profile edits", data);
        if (data.status === "profile edited") {
          const userdata = data.data;
          if (data.Changedlogin !== "no") {
            console.log("changed");
            // localStorage.setItem("username", JSON.stringify(userdata.username));
            // localStorage.setItem("password", JSON.stringify(userdata.password));
            props.Loginfunc("false");
          } else {
            props.setUserData(userdata);
            navigate("/profile", { state: { editprofile: "successfull" } });
            // setEditProfile("Profile Updated Successfully!");//green
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // setEditProfile("Error in Updating Profile!");//green
      });
  };

  return (
    <div>
        <Navbar
          Loginval={props.Loginval}
          Loginfunc={props.Loginfunc}
          userData={props.userData}
          setUserData={props.setUserData}
        />
        <br /><br /><br /><br /><br />
        <TableContainer component={Paper} className="container">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left" colSpan={2}>
                  <Typography variant="h3" color="#072F4A" gutterBottom>
                    Edit Profile
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell >First Name</TableCell>
                <TableCell >
                  <input
                    onChange={handleEditProfileChange}
                    value={ProfileData.fname}
                    type="text"
                    name="fname"
                    placeholder="First Name"
                    className="form-control"
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell >Last Name:</TableCell>
                <TableCell >
                  <input
                    onChange={handleEditProfileChange}
                    value={ProfileData.lname}
                    type="text"
                    name="lname"
                    placeholder="Last Name"
                    className="form-control"
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell >User Name:</TableCell>
                <TableCell >
                  <input
                    onChange={handleEditProfileChange}
                    value={ProfileData.username}
                    type="text"
                    name="username"
                    placeholder="User Name"
                    className="form-control"
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell >Email id:</TableCell>
                <TableCell >
                  <input
                    onChange={handleEditProfileChange}
                    value={ProfileData.emailid}
                    type="email"
                    name="emailid"
                    placeholder="Email Id"
                    className="form-control"
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell >Age:</TableCell>
                <TableCell >
                  <input
                    onChange={handleEditProfileChange}
                    value={ProfileData.age}
                    type="number"
                    name="age"
                    placeholder="Age"
                    className="form-control"
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell >Phone No:</TableCell>
                <TableCell >
                  <input
                    onChange={handleEditProfileChange}
                    value={ProfileData.phno}
                    type="tel"
                    name="phno"
                    placeholder="Phone Number"
                    className="form-control"
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell >Phone No:</TableCell>
                <TableCell >
                  <input
                    onChange={handleEditProfileChange}
                    type="password"
                    name="password"
                    placeholder="New/Old Password"
                    className="form-control"
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      handleEditProfile(e);
                    }}
                  >
                    Submit Profile
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    //   color={display?.Follower==="none" && 'secondary'}
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    Close
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  );
};
export default EditProfile;
