var express =require("express");
var router  = express.Router();
var Blog    =require("../models/blog")
var mdleWareObject= require("../middleware/index.js")


//INDEX PAGE

router.get("/", function (req,res){
    Blog.find({}, function (err, found){
        if(err){
            console.log(err)
        }else{
            res.render("index.ejs", {blogs:found})
        }
    })
})


//NEW ROUTE

router.get("/blogs/new",mdleWareObject.isLoggedIn ,function(req,res){
    res.render("new.ejs");
});

//NEW ROUTE POST

router.post("/blogs",mdleWareObject.isLoggedIn, function(req,res){
    
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
            req.flash("error", err.message)
            res.redirect("back")
        }else{
             newBlog.author.id=req.user._id
             newBlog.author.username=req.user.username;
             newBlog.save();
             req.flash("success", "NEW BLOG")
            res.redirect("/");
        }
    })
})

//SHOW ROUTE

router.get("/blogs/:id", function (req,res){
   Blog.findById(req.params.id).populate("comments").exec(function(err, found){
        if(err){
             req.flash("error", err.message)
             res.redirect("back");
        }else{
            res.render("show.ejs", {blog:found})
        }
    })
})

//EDIT ROUTE

router.get("/blogs/:id/edit",mdleWareObject.authorizeB, function (req,res){
    Blog.findById(req.params.id, function (err, found){
        if(err){
             req.flash("error", err.message)
             res.redirect("back");
        }else{
            res.render("edit.ejs", {blog:found})
        }
    })
})

//EDIT ROUTE PUT
router.put("/blogs/:id", mdleWareObject.authorizeB ,function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
             req.flash("error", err.message)
             res.redirect("back");
      }  else {
          req.flash("success", "NEW BLOG")
          res.redirect("/");
      }
   });
});


//DELETE ROUTE

router.delete("/blogs/:id", mdleWareObject.authorizeB, function (req,res){
    Blog.findByIdAndRemove(req.params.id, function(err, found){
        if(err){
          req.flash("error", err.message)
          res.redirect("back");
        }else{
            req.flash("success", "SUCCESSFUL DELETE")
          res.redirect("/");
        }
    })
})


module.exports=router;