const express = require("express");
const router = express.Router();

const db = require("../models/User");

router.put("/followers", async (req, res) => {
  const { username, followerUsername, flagFollow } = req.body;
  const user = await db.findOne({ username: username });
  const followUser = await db.findOne({ username: followerUsername });
  if (!user || !followUser) {
    return res.json({ status: "User Doesn't Exist!-followers", username });
  }
  try {
    if (flagFollow === 1) {
      // remove followUser from followers[] of user - higher
      // remove User from following[] of followUser - lower
      user.followers = user.followers.filter((followers) => {
        return followers.username !== followerUsername;
      });
      followUser.following = followUser.following.filter((following) => {
        return following.username !== username;
      });
    } else if (flagFollow === 2) {
      // remove followUser from following[] of user - lower
      // remove User from followers[] of followUser - higher
      user.following = user.following.filter((following) => {
        return following.username !== followerUsername;
      });
      followUser.followers = followUser.followers.filter((followers) => {
        return followers.username !== username;
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
  const { username } = req.body;
  const user = await db.findOne({ username: username });
  console.log("editprofile", req.body);
  if (!user) {
    return res.json({ status: "Editprofile-User Not Found!", username });
  }
  try {
    user = req.body;
    await user
      .save()
      .then((data) => res.json({ status: "profile edited", data }))
      .catch((error) => console.error("Editprofile-Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error updating Profile!" });
  }
});


module.exports = router;
