const express = require("express");
const router = express.Router();
const SavePost = require("../models/SavePost");

router.post("/add", async (req, res) => {
  const { Text } = req.body;

  if(!(Text.length > 0)){
    return res.json({ status: "All Fields are required!!" });
  }
  try {
    const newPost = new SavePost(req.body);
    await newPost
      .save()
      .then((data) => res.json(data))
      .catch((error) => console.error("Error:", error));

  } catch (error) {
    res.send({ status: "Error Saving the Post!" });
  }
});


module.exports = router;
