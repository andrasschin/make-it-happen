var mongoose = require("mongoose");

var goalSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    goal: String,
    realization: String,
    deadline: Date,
    created: {type: Date, default: Date.now},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    backgroundColor: String,
    motivationalQuote: {
        text: String,
        author: String
    }
});

var Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;