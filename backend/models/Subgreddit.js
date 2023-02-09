const mongoose = require("mongoose");
const SchemaPost = mongoose.Schema;

let Posts = new SchemaPost(
  {
    id: {
      type: Number,
      required: true
    },
    postedBy: {
      type: String,
      required: true,
    },
    postedIn: {
      type: String,
      required: true,
    },
    Text: {
      type: String,
      required: true,
    },
    // we store upvotes as list of id's/usernames of users who upvoted/downvoted
    upvotes: [],  
    downvotes: [],
    comments: [String]
  }
);

const Schema = mongoose.Schema;
let subGredditSchema = new Schema(
  {
    moderator: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tags: [],
    bannedKeywords: [],
    joined: [],
    requested: [],
    blocked: [],
    post: [Posts]
  },
  {
    timestamps: true,
    collection: "subgreddit",
  }
);

module.exports = mongoose.model("Subgreddit", subGredditSchema);
