var express = require("express");
var router = express.Router();
var Tool = require("../models/tool");
var middleware = require("../middleware/index.js");

// REST - INDEX
router.get("/", function (req, res) {
    // Get all tools from DB
    Tool.find({}, function (err, allTools) {
        if (err) {
            console.log(err);
        } else {
            res.render("tools/index", {
                tools: allTools
            });
        }
    });
});

// REST - CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    // Get data from form and add to tools array
    var name = req.body.name;
    var price = req.body.price;
    var img = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newTool = {
        name: name,
        price: price,
        image: img,
        description: desc,
        author: author
    };
    // Create a new tool and save to DB
    Tool.create(newTool, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // Redirect back to tools page
            res.redirect("/tools");
        }
    });
});

// REST - NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("tools/new");
});

// REST - SHOW
router.get("/:id", function (req, res) {
    // Find the tools with provided ID
    Tool.findById(req.params.id).populate("comments").exec(function (err, foundTool) {
        if (err) {
            console.log(err);
        } else {
            // Render template with that ID
            res.render("tools/show", {
                tool: foundTool
            });
        }
    });
});

// REST - EDIT tools route
router.get("/:id/edit", middleware.checkToolOwnership, function (req, res) {
    Tool.findById(req.params.id, function (err, foundTool) {
        res.render("tools/edit", {
            tool: foundTool
        });
    });
});

// REST - UPDATE tools route
router.put("/:id", middleware.checkToolOwnership, function (req, res) {
    Tool.findByIdAndUpdate(req.params.id, req.body.tool, function (err, updatedTool) {
        if (err) {
            console.log(err);
            res.redirect("/tools");
        } else {
            res.redirect("/tools/" + req.params.id);
        }
    });
});

// REST - DESTROY route
router.delete("/:id", middleware.checkToolOwnership, function (req, res) {
    Tool.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/tools");
        } else {
            res.redirect("/tools");
        }
    });
});


module.exports = router;
