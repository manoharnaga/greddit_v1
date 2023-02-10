const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

//Avoid Deprecated!
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE, () => {
  console.log("Connected to MongoDB");
});
//Avoid Deprecated!

//import routes
// const authRoutes = require('./routes/auth');
// const db = require('./models/User');
// const Subgreddit = require('./models/Subgreddit');
const authRoutes = require("./Auth/auth");
const profileRoutes = require("./Profile/editprofile");
const mySubgredditRoutes = require("./MySubGreddit/mySubGreddit");
const mySubgredditMODRoutes = require("./SubGredditMod/SubGredditMod");
const AkaSubbgredditRoutes = require("./AkaSubGreddits/AkaSubgreddit");
const SavedPost = require("./Savedpost/Savedpost");

//app
const app = express();
// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"));

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
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
// app.use(cors());
app.use(cors({
  origin: "*",
  optionsSuccessStatus: 200,
}));

//routes middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/mysubgreddits", mySubgredditRoutes);
app.use("/mysubgredditsmod",mySubgredditMODRoutes);
app.use("/akasubgreddits",AkaSubbgredditRoutes);
app.use("/savedpost",SavedPost)

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
