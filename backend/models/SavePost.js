const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SavePost = new Schema(
{
    savedby: {
        type: String,
        required: true,
    },
    subgreddit: {
        type: String,
        required: true,
    },
    moderator: {
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
    upvotes: [String],  
    downvotes: [String],
    comments: [String]
},{
   timestamps: true,
   collection: 'savepost'
})

module.exports = mongoose.model('savepost', SavePost);