var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    text: String,
    created: {type: Date, default: Date.now},
    goalOwnerColor: {type: String, default: "black"}
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;