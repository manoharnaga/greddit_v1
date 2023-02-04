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
app.use(cors());

//routes middleware
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/mysubgreddits", mySubgredditRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
