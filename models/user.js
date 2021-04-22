var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    goals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Goal"
        }
    ],
});
userSchema.plugin(passportLocalMongoose); // adding certain methods to user model

var User = mongoose.model("User", userSchema);

module.exports = User;