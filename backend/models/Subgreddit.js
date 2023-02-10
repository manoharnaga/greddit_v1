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
    comments: [String],
    savedby: [String]
  }
);

const SchemaReport = mongoose.Schema;
let Report = new SchemaReport(
  {
    postid: {
      type: String,
      required: true,
    },
    reportedBy: {
      type: String,
      required: true,
    },
    reportedVictim: {
      type: String,
      required: true,
    },
    concern: {
      type: String,
      required: true,
    },
    Text: {
      type: String,
      required: true,
    }
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
    leftsub: [],
    post: [Posts],
    report: [Report]
  },
  {
    timestamps: true,
    collection: "subgreddit",
  }
);

module.exports = mongoose.model("Subgreddit", subGredditSchema);
