const express = require("express");
const router = express.Router();

const db = require("../models/User");

router.post("/register", async (req, res) => {
  const { fname, lname, username, emailid, age, phno, password } = req.body;
  isRequired =
    fname.length > 0 &&
    lname.length > 0 &&
    username.length > 0 &&
    emailid.length > 0 &&
    age.length > 0 &&
    phno.length > 0 &&
    password.length > 0;

  // check if empty fields
  if (!isRequired) {
    return res.json({ status: "All Fields are required!!" });
  }
  try {
    // const oldUser = await db.findOne({ username });
    // if(oldUser){
    //   res.send({status:"Username already exists!!"});
    // }
    // else{
    const newData = new db(req.body);
    await newData
      .save()
      .then((data) => res.json(data))
      .catch((error) => console.error("Error:", error));
    // }
  } catch (error) {
    res.send({ status: "Error submitting new UserRegistration!" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.findOne({ username, password });
  // check if user exists -- empty fields are also handled
  if (!user) {
    return res.json({ status: "User Doesn't Exist!", username, password });
  }
  //bcrypt + jwt(token)
  if (res.status(201)) {
    return res.json({ status: "Login successful!", user });
  } else {
    return res.json({ status: "Error: Login Unsuccessful!" });
  }
});

module.exports = router;
