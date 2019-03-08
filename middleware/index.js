
var Blog=require("../models/blog");
var Comment=require("../models/comments");


var mdleWareObject={};

mdleWareObject.isLoggedIn=function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


mdleWareObject.authorizeC= function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, found) {
            if(err){
                req.flash("error", "Campground not Found")
               res.redirect("back");
            }else{
               if(req.user._id.equals(found.author.id)){
                   return next();
               }else{
                   req.flash("error", "You dont have permission")
                   res.redirect("/login");
               } 
            }
        })
      
    }else{
             req.flash("error", "You need to login")
             res.redirect("/login");
        }
    
    }
    
mdleWareObject.authorizeB= function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, found) {
            if(err){
               req.flash("error", "Campground not Found")
               res.redirect("back");
            }else{
                console.log(found)
               if(req.user._id.equals(found.author.id)){
                   return next();
               }else{
                  req.flash("error", "You dont have permission")
                   res.redirect("/login");
               } 
            }
        })
      
    }else{
             req.flash("error", "You need to login")
             res.redirect("/login");
        }
    
    }

module.exports=mdleWareObject;