var Goal    = require("../models/goal.js");
var Comment = require("../models/comment.js");

var middlewareObj = {}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

middlewareObj.checkGoalOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Goal.findById(req.params.id, function(err, foundGoal){
            if(err){
                console.log(err);
            } else {
                if(foundGoal.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnerShip = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    }
}

module.exports = middlewareObj;