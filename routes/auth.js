var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user.js");

// Register
router.get("/register", function(req, res){
    res.render("authentication/register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, newUser){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/goals");
            });
        }
    });
});

// Login
router.get("/login", function(req, res){
    res.render("authentication/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/goals",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res){
});

// Logout
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;