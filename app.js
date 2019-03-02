var express = require('express');
var app = express();

var bodyParser=require("body-parser");

var request=require("request");

var mongoose=require("mongoose");

var methodOverride = require('method-override');


var passport=require("passport");
var LocalStrategy = require("passport-local")

var Blog= require("./models/blog.js");
var Comment=require("./models/comments.js");
var User=require("./models/user.js");
var flash= require("connect-flash");




//SET UP //------------------------------------------------------
mongoose.connect("mongodb://localhost/YourDB", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//FLASH USE
app.use(flash());

//LOCALS VARIABLES//---------------
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success= req.flash("success");
   res.locals.error= req.flash("error");
   next();
});



//ROUTES //
//requring routes
var commentRoutes    = require("./routes/comments"),
    blogRoutes       = require("./routes/blogs"),
    indexRoutes      = require("./routes/index")


app.use(indexRoutes);
app.use(blogRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT, process.env.IP,function(){
    console.log("hey we are in baby");
});

