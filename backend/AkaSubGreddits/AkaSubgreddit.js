const express = require("express");
const router = express.Router();
const Subgreddit = require("../models/Subgreddit");

router.get("/dataall", async (req, res) => {
  const AkaSubgreddits = await Subgreddit.find();
  if (!AkaSubgreddits) {
    return res.json({ status: "No Subgreddits found!" });
  }
  if (res.status(201)) {
    return res.json({
      status: "AKAsubgredditUsers sent",
      AkaSubgreddits,
    });
  } else {
    return res.json({ status: "Error: Can't Send AkaSubbgreddits" });
  }
});




// Aka Subgreddit One

router.post("/data", async (req, res) => {
  const { id } = req.body;
  const AkaSubgredditPost = await Subgreddit.findOne({ _id: id });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!AkaSubgredditPost) {
    return res.json({ status: "No AkaSubgredditPost found!", moderator });
  }
  if (res.status(201)) {
    // if(akaPostFlag === 2){
    //   AkaSubgredditPost.post = SubGredditData.post;
    // }
    // else{
      return res.json({
        status: "AkasubgredditPost sent",
        AkaSubgredditPost,
      });
    // }
  } else {
    return res.json({ status: "Error: Can't Send AkaSubbgredditPost" });
  }
});



router.put("/addpost", async (req, res) => {
  const {postedBy , postedIn, Text} = req.body;
  const AkaSubgreddit = await Subgreddit.findOne({ _id: postedIn });
  console.log(postedIn);
  // check if any Subgreddit exists -- empty fields are also handled
  if (!AkaSubgreddit) {
    return res.json({ status: "No AkaSubgreddit found!",postedBy});
  }
   console.log("yes");

  try {

    AkaSubgreddit.post.push({
      id: AkaSubgreddit.post.length,
      postedBy: postedBy,
      postedIn: postedIn,
      Text: Text,
      upvotes: 0,
      downvotes: 0,
      comments: []
    });

    console.log('From Backend Post!',AkaSubgreddit);

    await AkaSubgreddit
      .save()
      .then((data) =>
        res.json({
          status: "Post Created Successfully!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error Creating Post!" });
  }
});


module.exports = router;
