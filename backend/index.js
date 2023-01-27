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



app.post('/register', (req, res) => {
  console.log(req.body);
  const {fname, lname, username, emailid, age, phno, password} = req.body;
  // console.log(fname,lname,username,emailid,age,phno,password);
  isRequired = (fname && lname && username && emailid && age && phno && password);

  if(!isRequired){
    return res.json({status: "All Fields are required!!"});
  }
  try {
    const oldUser = db.findOne({ username });
    // if(oldUser){
    //   res.send({status:"Username already exists!!"});
    // }
    // else{
      const newData = new db(req.body);
      newData.save().then(data => res.json(data));
    // }
  } catch (error) {
    res.send({status: "Error submitting!"});
  }
});


app.post('/login',async (req,res) => {
  const {username , password} = req.body;
  const user = await db.findOne({username,password});
  if(!user){
    return res.json({status:"User Doesn't Exist!"});
  }
  //bcrypt + jwt(token)
  if(res.status(201)){
    return res.json({status: "Login successful!",user});
  }
  else{
    return res.json({status: "Error: Login Unsuccessful!"});
  }
});



const port = process.env.PORT || 8006;
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
});
