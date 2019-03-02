var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//----------------------------------------------------------------
//AUTHENTICATION ROUTES///---------------------------------------------


//handling register//--------------
router.get("/register", function(req,res){
     if(req.isAuthenticated()){
         req.flash("error", "you need to log out")
         res.redirect("/")
     }
    res.render("register.ejs")
});

router.post("/register", function(req,res){
      var newUser = new User({username: req.body.username, emai: req.body.email});
      User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message)
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Pattern")
           res.redirect("/"); 
        });
    });
})

// handling login logic--------------
router.get("/login", function(req, res){
   res.render("login.ejs"); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true 
    }), function(req, res){
});

// logout logic------------------------
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged out")
   res.redirect("/");
});



module.exports=router;