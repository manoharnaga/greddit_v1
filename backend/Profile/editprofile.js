const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../models/User");

router.put("/followers", async (req, res) => {
  const { username, followerUsername, flagFollow } = req.body;
  const user = await db.findOne({ username: username });
  const followUser = await db.findOne({ username: followerUsername });
  if (!user || !followUser) {
    return res.json({ status: "User Doesn't Exist!", username });
  }
  try {
    if (flagFollow === 1) {
      // remove followUser from followers[] of user - higher
      // remove User from following[] of followUser - lower
      user.followers = user.followers.filter((followers) => {
        return followers !== followerUsername;
      });
      followUser.following = followUser.following.filter((following) => {
        return following !== username;
      });
    } else if (flagFollow === 2) {
      // remove followUser from following[] of user - lower
      // remove User from followers[] of followUser - higher
      user.following = user.following.filter((following) => {
        return following !== followerUsername;
      });
      followUser.followers = followUser.followers.filter((followers) => {
        return followers !== username;
      });
    }

    let firstResponse = {};
    await user
      .save()
      .then((data) => (firstResponse = data))
      .catch((error) => console.error("Error:", error));
    await followUser
      .save()
      .then((data) =>
        res.json({ status: "both recieved", firstResponse, data })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error updating followers list!" });
  }
});



router.put("/editprofile", async (req, res) => {
  const { 
    prevUsername,
    fname,
    lname,
    username,
    emailid,
    age,
    phno,
    password } = req.body;

  isRequired =
    prevUsername.length > 0 &&
    fname.length > 0 &&
    lname.length > 0 &&
    username.length > 0 &&
    emailid.length > 0 &&
    age.length > 0 &&
    phno.length > 0 &&
    password.length > 0;
    
  console.log(req.body);

  if (!isRequired) {
    return res.json({ status: "All Fields are required!!" });
  }
  
  const user = await db.findOne({ username: prevUsername });
  // console.log("editprofile", req.body);
  if (!user) {
    return res.json({ status: "User Not Found!", username });
  }

  try {
    user.fname      = fname        
    user.lname      = lname 
    user.username   = username 
    user.emailid    = emailid 
    user.age        = age 
    user.phno       = phno 

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    
    // let Changedlogin = "no";
    // if(prevPassword !== password || prevUsername !== username){
    //   Changedlogin = "yes"
    // }
    console.log('User edited');
    await user
      .save()
      .then((data) => res.json({ status: "profile edited", data}))
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error updating Profile!" });
  }
});


module.exports = router;
