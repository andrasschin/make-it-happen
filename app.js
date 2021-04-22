// Enviroment variables
require("dotenv").config()

// Dependencies
var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    flash           = require("connect-flash");

// App setup
var app = express();

// Routes
var goalRoutes      = require("./routes/goals"),
    commentRoutes   = require("./routes/comments"),
    authRoutes      = require("./routes/auth");

// Models
var Goal    = require("./models/goal.js"),
    Comment = require("./models/comment.js"),
    User    = require("./models/user.js");

mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log("ERROR: " + err.message);
});

// App setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true})); //body-parser
app.use(express.static("public"));
app.use(methodOverride("_method")); // method-override
app.use(flash());

// App setup - passport config
app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware function will be called on every route => passing currentUser to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

// Routes setup
app.use(goalRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.get("/", function(req, res){
    res.render("landing.ejs");
});

app.get("*", function(req, res){
    res.send("Page not found.")
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running!");
});

/*

TASKS
________________

Goal Accomplished
Index.ejs hover optimization
Goal - like
Followed panel

*/