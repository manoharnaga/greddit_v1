const express = require("express");
const router = express.Router();
const Subgreddit = require("../models/Subgreddit");
// moderator -- mod --> subgreddits

router.post("/data", async (req, res) => {
  const { id } = req.body;
  const MySubgreddit = await Subgreddit.findOne({ _id: id });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!MySubgreddit) {
    return res.json({ status: "No Subgreddit found!", moderator });
  }
  //bcrypt + jwt(token)

  if (res.status(201)) {
    return res.json({
      status: "modsubgredditUsers sent",
      MySubgreddit,
    });
  } else {
    return res.json({ status: "Error: Can't Send ModSubbgredditUsers" });
  }
});

router.put("/request", async (req, res) => {
  const { id, username, flagRequest } = req.body;
  const MySubgredditMod = await Subgreddit.findOne({ _id: id });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!MySubgredditMod) {
    return res.json({ status: "No Subgreddits found!", moderator });
  }
  try {
    MySubgredditMod.requested = MySubgredditMod.requested.filter((user) => {
      return user !== username;
    });
    if (flagRequest === 1) {
      MySubgredditMod.joined.push(username);
    }

    await MySubgredditMod.save()
      .then((data) =>
        res.json({
          status: "joiningRequest Successfull!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error updating Joining Requests list!" });
  }
});


router.put("/delpost", async (req, res) => {
  const { subid, postid } = req.body;
  const MySubgredditMod = await Subgreddit.findOne({ _id: subid });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!MySubgredditMod) {
    return res.json({ status: "No Subgreddits found!", subid });
  }
  try {
    MySubgredditMod.post = 
    MySubgredditMod.post.slice(postid)
    .concat(MySubgredditMod.post.slice(postid+1,MySubgredditMod.post?.length));
    
    await MySubgredditMod.save()
      .then((data) =>
        res.json({
          status: "joiningRequest Successfull!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error updating Joining Requests list!" });
  }
});

module.exports = router;
