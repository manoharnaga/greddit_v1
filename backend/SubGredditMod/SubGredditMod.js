const express = require("express");
const router = express.Router();
const Subgreddit = require("../models/Subgreddit");
// moderator -- mod --> subgreddits

router.post("/data", async (req, res) => {
  const { id } = req.body;
  const MySubgreddits = await Subgreddit.findOne({ _id: id });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!MySubgreddits) {
    return res.json({ status: "No Subgreddits found!", moderator });
  }
  //bcrypt + jwt(token)

  if (res.status(201)) {
    return res.json({
      status: "modsubgredditUsers sent",
      SubgredditData: MySubgreddits,
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
    MySubgredditMod.requests = MySubgredditMod.requests.filter((user) => {
      return user !== username;
    });
    if (flagRequest === 1) {
      MySubgredditMod.users.push(username);
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

module.exports = router;
