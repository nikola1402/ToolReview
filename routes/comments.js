var express = require("express");
var router = express.Router({
    mergeParams: true
});
var Tool = require("../models/tool");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

// Comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Tool.findById(req.params.id, function (err, foundTool) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                tool: foundTool
            });
        }
    })
});

// Create comments
router.post("/", middleware.isLoggedIn, function (req, res) {
    // Lookup tool using ID
    Tool.findById(req.params.id, function (err, foundTool) {
        if (err) {
            console.log(err);
            res.redirect("/tools");
        } else {
            // Create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log(comment);
                    // Connect new comment to tool
                    foundTool.comments.push(comment._id);
                    foundTool.save();
                    console.log(foundTool);

                    // Redirect tool show page
                    res.redirect("/tools/" + foundTool._id);
                }
            });
        }
    });
});

// Edit comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                tool_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

// Update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/tools/" + req.params.id);
        }
    });
});

// Destroy comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/tools/" + req.params.id);
        }
    });
});

module.exports = router;
