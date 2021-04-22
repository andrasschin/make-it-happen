var express    = require("express");
var router     = express.Router();
var Goal       = require("../models/goal.js");
var User       = require("../models/user.js")
var middleware = require("../middleware"); //automatically require the contents of index.js
var motivation = require("motivation");

// Index route
router.get("/goals", function(req, res){
    var searchUser = "";
    if(!req.user && !req.query.username){
        res.render("goals/index", {goals: [], searchedUN: searchUser});
    }
    else if(req.query.username){
        searchUser = req.query.username;
        displayGoals(searchUser);
    }
    else if(req.user && !req.query.username){
        searchUser = req.user.username;
        displayGoals(searchUser);
    }
    function displayGoals(searchUser){
        User.find({username: searchUser}, function(err, foundUser){
            if(err || !foundUser[0]){
                req.flash("error", "User not found")
                res.redirect("/goals");
            } else {
                User.findById(foundUser[0]._id).populate("goals").exec(function(err, foundUserById){
                    if(err){
                        console.log(err);
                    }
                    else {
                        res.render("goals/index", {goals: foundUserById.goals, searchedUN: searchUser});
                    }
                });
            }
        });
    }
});

// New route
router.get("/goals/new", middleware.isLoggedIn, function(req, res){
    res.render("goals/new");
});

// Create route
router.post("/goals", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            var newGoal = {
                author: {
                    id: req.user._id,
                    username: req.user.username
                },
                goal: req.body.goal.goal,
                realization: req.body.goal.realization,
                deadline: req.body.goal.deadline,
                backgroundColor: randomBackgroundColor(),
                motivationalQuote: motivation.get()
            }
            Goal.create(newGoal, function(err, createdGoal){
                if(err){
                    req.flash("error", "Couldn't create goal");
                    res.redirect("/goals")
                } else {
                    foundUser.goals.push(createdGoal);
                    foundUser.save();
                    req.flash("success", "Goal created");
                    res.redirect("/goals");
                }
            });
        }
    });
});

function randomBackgroundColor(){
    var colors = ["#afff2e", "#2eff85", "#2ef1ff", "#7e2eff", "#ee2eff", "#ff2e7e"]
    var rnd = Math.floor(Math.random() * colors.length);
    return colors[rnd];
}

// Show route
router.get("/goals/:id", function(req, res){
    Goal.findById(req.params.id).populate("comments").exec(function(err, foundGoal){
        if(err || !foundGoal){
            req.flash("error", "Can't find goal")
            res.redirect("/goals");
        } else {
            res.render("goals/show", {goal: foundGoal});
        }
    });
});

// Edit route
router.get("/goals/:id/edit", middleware.checkGoalOwnership, function(req, res){
    Goal.findById(req.params.id, function(err, foundGoal){
        res.render("goals/edit", {goal: foundGoal});
    });
});

// Update route
router.put("/goals/:id", middleware.checkGoalOwnership, function(req, res){
    Goal.findByIdAndUpdate(req.params.id, req.body.goal, function(err, updatedGoal){
        res.redirect("/goals/" + req.params.id);
    });
});

// Delete route
router.delete("/goals/:id", middleware.checkGoalOwnership, function(req, res){
    Goal.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/goals");
    });
});

module.exports = router;