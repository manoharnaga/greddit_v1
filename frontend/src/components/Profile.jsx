import { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Typography } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = (props) => {
  const [display, setDisplay] = useState({
    Follower: "none",
    Following: "none",
  });
  // const [EditProfile,setEditProfile] = useState("");
  let location = useLocation();
  let navigate = useNavigate();

  const [open, setOpen] = useState(() => {
    let flag = location?.state?.editprofile === "successfull";
    location.state = {};
    console.log(flag);
    return flag;
  });

  if (props.Loginval === "false") {
    return <Navigate to="/login" />;
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const removeFollow = async (username, followerUsername, flagFollow) => {
    await fetch(`http://localhost:7000/profile/followers`, {
      method: "PUT",
      crossDomain: true,
      body: JSON.stringify({
        username: username,
        followerUsername: followerUsername,
        flagFollow: flagFollow,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "both recieved") {
          console.log("both recieved", data);
          const userdata = data.firstResponse;
          props.setUserData(userdata);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <TableContainer component={Paper} className="container">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" colSpan={2}>
                <Typography variant="h3" color="#072F4A" gutterBottom>
                  Helo @{props.userData.username}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell style={{ fontSize: "125%" }}>First Name</TableCell>
              <TableCell style={{ fontSize: "125%" }}>
                {props.userData.fname}
              </TableCell>
            </TableRow>

            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell style={{ fontSize: "125%" }}>Last Name:</TableCell>
              <TableCell style={{ fontSize: "125%" }}>
                {props.userData.lname}
              </TableCell>
            </TableRow>

            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell style={{ fontSize: "125%" }}>User Name:</TableCell>
              <TableCell style={{ fontSize: "125%" }}>
                {props.userData.username}
              </TableCell>
            </TableRow>

            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell style={{ fontSize: "125%" }}>Email id:</TableCell>
              <TableCell style={{ fontSize: "125%" }}>
                {props.userData.emailid}
              </TableCell>
            </TableRow>

            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell style={{ fontSize: "125%" }}>Age:</TableCell>
              <TableCell style={{ fontSize: "125%" }}>
                {props.userData.age}
              </TableCell>
            </TableRow>

            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell style={{ fontSize: "125%" }}>Phone No:</TableCell>
              <TableCell style={{ fontSize: "125%" }}>
                {props.userData.phno}
              </TableCell>
            </TableRow>

            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell colSpan={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<EditIcon />}
                  onClick={() => {
                    // setEditProfile("openEditProfilePage");
                    navigate("/editprofile");
                  }}
                >
                  Edit Profile
                </Button>
              </TableCell>
            </TableRow>

            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Button
                //   color={display?.Following==="none" && 'secondary'}
                  onClick={() => {
                    setDisplay({ Follower: "", Following: "none" });
                  }}
                >
                  Followers {props.userData.followers?.length}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                //   color={display?.Follower==="none" && 'secondary'}
                  onClick={() => {
                    setDisplay({ Follower: "none", Following: "" });
                  }}
                >
                  Following {props.userData.following?.length}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer
        component={Paper}
        className="container"
        style={{ display: display.Follower }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {props.userData.followers?.map((follower, index) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                key={index}
              >
                <TableCell align="center" style={{ fontSize: "125%" }}>
                  {follower}
                </TableCell>
                <TableCell align="center" style={{ fontSize: "125%" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                      removeFollow(props.userData.username, follower, 1);
                    }}
                    style={{ backgroundColor: "#656768" }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center" colSpan={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setDisplay({ Follower: "none", Following: "none" });
                  }}
                  color="action"
                >
                  close
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer
        component={Paper}
        className="container"
        style={{ display: display.Following }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {props.userData.following?.map((following, index) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                key={index}
              >
                <TableCell align="center" style={{ fontSize: "125%" }}>
                  {following}
                </TableCell>
                <TableCell align="center" style={{ fontSize: "125%" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                      removeFollow(props.userData.username, following, 2);
                    }}
                    style={{ backgroundColor: "#656768" }}
                  >
                    Unfollow
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center" colSpan={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setDisplay({ Follower: "none", Following: "none" });
                  }}
                  color="action"
                >
                  close
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Profile Edited Successfully!
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
};

export default Profile;
