var express =require("express");
var router  = express.Router();
var Blog    =require("../models/blog")
var Comment =require("../models/comments")
var mdleWareObject= require("../middleware/index.js")



//----------------------------------------------------------------
//COMMENTS ROUTES///---------------------------------------------

router.get("/blogs/:id/comments/new", mdleWareObject.isLoggedIn, function (req,res){
    Blog.findById(req.params.id, function(err,found){
        if (err || !found){
           req.flash("error", err.message)
             res.redirect("back");
        }else{
            res.render("newcomment.ejs", {blog:found}); 
        }
    }
       
)});

router.post("/blogs/:id/comments", mdleWareObject.isLoggedIn, function(req,res){
    var x=req.params.id
    Blog.findById(req.params.id, function(err,found){
        if (err || !found){
           req.flash("error", err.message)
             res.redirect("back");
        }else{
            console.log(req.body.comment)
            Comment.create(req.body.comment, function(err, comment){
                if (err || ! comment){
                    req.flash("error", err.message)
                    res.redirect("back");
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    found.comments.push(comment);
                    found.save();
                    req.flash("success", "New comment")
                    res.redirect("/blogs/"+x);
                    
                }
            })
        }
    })
})

router.get("/blogs/:id/comments/:comment_id/edit", mdleWareObject.authorizeC, function (req,res){
    Blog.findById(req.params.id, function(err, campground){
       if(err || !campground){
           req.flash("error", err.message)
           res.redirect("back");
       } else {
              Comment.findById(req.params.comment_id, function (err, found){
                   if(err || !found){
                          req.flash("error", err.message)
                          res.redirect("back");
                      }else{
                         res.render("commentedit.ejs", {blogId:req.params.id, comment:found})
        }
    })
}

 })})

router.put("/blogs/:id/comments/:comment_id/",  mdleWareObject.authorizeC, function(req, res){
       Blog.findById(req.params.id, function(err, campground){
       if(err || !campground){
           req.flash("error", err.message)
           res.redirect("back");
       } else {
             Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedcomment){
                     if(err){
                          req.flash("error", err.message)
                         res.redirect("back");
                      }  else {
                          console.log(req.body.comment)
                          res.redirect("/blogs/"+req.params.id);
                          
        }
    })
}

 })})


router.delete("/blogs/:id/comments/:comment_id",  mdleWareObject.authorizeC, function (req,res){
       Blog.findById(req.params.id, function(err, campground){
       if(err || !campground){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
            Comment.findByIdAndRemove(req.params.comment_id, function(err){
                 if(err){
                      req.flash("error", err.message)
                        res.redirect("back");
                     }else{
                         res.redirect("/");
                          res.redirect("/blogs/"+req.params.id);
        

                         
        }
    })
}

 })})


module.exports=router;