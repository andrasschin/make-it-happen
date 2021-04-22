var express     = require("express");
var router      = express.Router();
var Goal        = require("../models/goal.js");
var Comment     = require("../models/comment.js");
var middleware  = require("../middleware");

// Create route
router.post("/goals/:id/comment", middleware.isLoggedIn, function(req, res){
    Goal.findById(req.params.id, function(err, foundGoal){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, createdComment){
                if(err) {
                    console.log(err);
                } else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    if(foundGoal.author.id.equals(createdComment.author.id)){
                        createdComment.goalOwnerColor = "#be0000";
                    } 
                    createdComment.save();
                    foundGoal.comments.push(createdComment);
                    foundGoal.save();
                    res.redirect("/goals/" + req.params.id);
                }
            });
        }
    });
});

// Delete route
router.delete("/goals/:id/comment/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Goal.findById(req.params.id, function(err, foundGoal){
        if(err || !foundGoal){
            req.flash("error", "Can't find goal");
            res.redirect("/goals");
        } else {
            Comment.findByIdAndRemove(req.params.comment_id, function(err){
                if(err){
                    console.log(err);
                } else {
                    res.redirect("/goals/" + req.params.id);
                }
            })
        }
    });
});

module.exports = router;