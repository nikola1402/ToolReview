var middlewareObj = {};
var Tool = require("../models/tool");
var Comment = require("../models/comment");

middlewareObj.checkToolOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Tool.findById(req.params.id, function (err, foundTool) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundTool.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("You have not created this post.");
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
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

// Middleware
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}




module.exports = middlewareObj
