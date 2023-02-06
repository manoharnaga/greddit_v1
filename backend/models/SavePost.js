const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SavePost = new Schema(
{
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
    upvotes: {
        type: Number,
        required: true
    },
    downvotes: {
        type: Number,
        required: true
    },
    comments: [String]
},{
   timestamps: true,
   collection: 'savepost'
})

module.exports = mongoose.model('savepost', SavePost);