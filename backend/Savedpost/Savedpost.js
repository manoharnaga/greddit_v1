const express = require("express");
const router = express.Router();
const Subgreddit = require("../models/Subgreddit");


router.put("/add", async (req, res) => {
  const { 
    subid,
    postid, 
    savedby } = req.body;

  const AkaSubgreddit = await Subgreddit.findOne({ _id: subid });
  
  if(!AkaSubgreddit){
    return res.json({ status: "AkaSubgreddit not found!",subid});
  }
  try {
    if(!AkaSubgreddit.post[postid].savedby.includes(savedby)){
      AkaSubgreddit.post[postid].savedby.push(savedby);
    }
    await AkaSubgreddit.save()
      .then((data) =>
        res.json({
          status: "Saved Post Successfully!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.send({ status: "Error Saving the Post!" });
  }
});


router.put("/remove", async (req, res) => {
  const { 
    subid,
    postid, 
    savedby } = req.body;

  const AkaSubgreddit = await Subgreddit.findOne({ _id: subid });
  
  if(!AkaSubgreddit){
    return res.json({ status: "AkaSubgreddit not found!",subid});
  }
  try {
    
    AkaSubgreddit.post[postid].savedby = AkaSubgreddit.post[postid]
    .savedby.filter((savedbyUser) => {
      return savedbyUser !== savedby;
    });

    await AkaSubgreddit.save()
      .then(async (data) => {
        const AkaSubgreddits = await Subgreddit.find();
        res.json({
          status: "Removed Saved Post Successfully!",
          AkaSubgreddits: AkaSubgreddits,
          SubgredditData:data
        })
      }
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.send({ status: "Error Saving the Post!" });
  }
});

module.exports = router;
