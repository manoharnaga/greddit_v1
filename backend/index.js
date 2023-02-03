const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

//Avoid Deprecated!
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE, () => {
    console.log("Connected to MongoDB");
});
//Avoid Deprecated!


//import routes
const authRoutes = require('./routes/auth');
const db = require('./models/User');
const Subgreddit = require('./models/Subgreddit');
const { response } = require('express');

//app
const app = express();
// db
mongoose
  .connect(process.env.DATABASE,{
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
   })
  .then(() => console.log('DB Connected'));


module.exports = {
    connectToServer: function (callback) {
      client.connect(function (err, db) {
        // Verify we got a good "db" object
        if (db)
        {
          _db = db.db("users");
          console.log("Successfully connected to MongoDB."); 
        }
        return callback(err);
           });
    },
   
    getDb: function () {
      return _db;
    },
  };

//middlewares
app.use(bodyParser.json());
app.use(cors());

//routes middleware
// app.use('/login', authRoutes);



app.post('/register',async (req, res) => {
  const {fname, lname, username, emailid, age, phno, password} = req.body;
  isRequired = ((fname.length>0) && (lname.length>0) && (username.length>0) && (emailid.length>0) && (age.length>0) && (phno.length>0) && (password.length>0));

  // check if empty fields
  if(!isRequired){  
    return res.json({status: "All Fields are required!!"});
  }
  try {
    // const oldUser = await db.findOne({ username });
    // if(oldUser){
    //   res.send({status:"Username already exists!!"});
    // }
    // else{
      const newData = new db(req.body);
      await newData.save()
      .then(data => res.json(data))
      .catch(error => console.error('Error:', error));
    // }
  } catch (error) {
    res.send({status: "Error submitting new UserRegistration!"});
  }
});


app.post('/login',async (req,res) => {
  const {username , password} = req.body;
  const user = await db.findOne({username,password});
  // check if user exists -- empty fields are also handled
  if(!user){
    return res.json({status:"User Doesn't Exist!",username,password});
  }
  //bcrypt + jwt(token)
  if(res.status(201)){
    return res.json({status: "Login successful!",user});
  }
  else{
    return res.json({status: "Error: Login Unsuccessful!"});
  }
});

app.put("/followers", async (req, res) => {
    const { username,followerUsername,flagFollow } = req.body;
    const user = await db.findOne({username:username});
    const followUser = await db.findOne({username:followerUsername});
    if (!user || !followUser) {
      return res.json({status:"User Doesn't Exist!",username});
    }
    try {
      if(flagFollow === 1){
        // remove followUser from followers[] of user - higher
        // remove User from following[] of followUser - lower
        user.followers = user.followers.filter((followers) => {return (followers.username !== followerUsername);});
        followUser.following = followUser.following.filter((following) => {return (following.username !== username);});
      }
      else if(flagFollow === 2){
        // remove followUser from following[] of user - lower
        // remove User from followers[] of followUser - higher
        user.following = user.following.filter((following) => {return (following.username !== followerUsername);});
        followUser.followers = followUser.followers.filter((followers) => {return (followers.username !== username);});
      }

      let firstResponse = {};
      await user.save()
      .then(data => firstResponse=data)
      .catch(error => console.error('Error:', error));
      await followUser.save()
      .then(data => res.json({status:"both recieved",firstResponse,data}))
      .catch(error => console.error('Error:', error));

    } catch (error) {
      res.status(500).send({status: "Error updating followers list!"});
    }
});




// Subgreddit
app.post('/mysubgredditadd',async (req, res) => {
  console.log(req.body);
  const {moderator,name} = req.body;
  isRequired = (name.length>0) && (moderator.length>0);

  // check if empty fields
  if(!isRequired){  
    return res.json({status: "Name,Moderator are required!!"});
  }
  try {
      const newData = new Subgreddit(req.body);
      await newData.save()
      .then(data => res.json(data))
      .catch(error => console.error('Error:', error));
  } catch (error) {
    res.send({status: "Error submitting Subgreddit!"});
  }
});


app.post('/mysubgreddits',async (req,res) => {
  const {moderator} = req.body;
  const MySubgreddits = await Subgreddit.find({moderator});
  // check if any Subgreddit exists -- empty fields are also handled
  if(!MySubgreddits){
    return res.json({status:"No Subgreddits found!",moderator});
  }
  //bcrypt + jwt(token)
  if(res.status(201)){
    return res.json({status: "mysubgreddits sent",MySubgreddits});
  }
  else{
    return res.json({status: "Error: Login Unsuccessful!"});
  }
});




const port = process.env.PORT || 8005;
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
});
