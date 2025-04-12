const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verify-token'); // Fixed typo
const User = require('../models/user');
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');


// Creating a recipe
router.post("/", verifyToken, async (req, res) => {
    try {

        const { title, description, body, image } = req.body;

        const recipe = new Recipe({
            title,
            description,
            body,
            image,
            createdAt: Date.now(),
            originalPoster: req.user._id,
            comments: [], // comments handled seperately
        });

        await recipe.save();
        
        // save recipe to user
        const user = await User.findById(req.user._id);
        user.recipes.push(recipe._id);
        await user.save();

        res.status(201).json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// retrieves info about all recipes
router.get("/" , verifyToken, async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        if (!recipes) {
          return res.status(404).json({ err: 'Recipes not found' });
        }
        console.log(recipes);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// retrieves info about specified recipe only
router.get("/:recipeId", verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (!recipe) {
            return res.status(404).json({ err: 'Recipe not found' });
        }
        console.log(recipe);
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// updates a specified recipe
router.put("/:recipeId", verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (!recipe) {
            return res.status(404).json({ err: 'Recipe not found' });
        }
        if (req.user._id.toString() !== recipe.originalPoster.toString()) {
            return res.status(403).json({ err: 'Unauthorized' });
        }
        const { title, description, body, image } = req.body;
        recipe.title = title;
        recipe.description = description;
        recipe.body = body;
        recipe.image = image;
        await recipe.save();
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// deletes a specified recipe
router.delete("/:recipeId", verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (!recipe) {
            return res.status(404).json({ err: 'Recipe not found' });
        }
        if (req.user._id.toString() !== recipe.originalPoster.toString()) {
            return res.status(403).json({ err: 'Unauthorized' });
        }
            await Recipe.findByIdAndDelete(req.params.recipeId);
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// retrieves all comments for a specified recipe
router.get("/:recipeId/comments", verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate('comments');
        if (!recipe) {
            return res.status(404).json({ err: 'Recipe not found' });
        }
        res.json(recipe.comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// adds a comment to post ID'd
router.post("/:recipeId/comments", verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (!recipe) {
            return res.status(404).json({ err: 'Recipe not found' });
        }
        const { text } = req.body;
        const comment = new Comment({
            text,
            createdAt: Date.now(),
            commentAuthor: req.user._id,
            originalPost: recipe._id,
        });
        await comment.save();
        recipe.comments.push(comment._id);
        await recipe.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// retrieves all comments for a specified recipe
router.get("/:recipeId/comments", verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate('comments');
        if (!recipe) {
            return res.status(404).json({ err: 'Recipe not found' });
        }
        res.json(recipe.comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// retrieves a specific comment for a specified recipe
router.get("/:recipeId/comments/:commentId", verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        const comment = await Comment.findById(req.params.commentId);
        if (!recipe || !comment) {
            return res.status(404).json({ err: 'Comment not found' });
        }
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// updates specific comment for a specified recipe
router.put("/:recipeId/comments/:commentId", verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        const comment = await Comment.findById(req.params.commentId);
        if (!recipe || !comment) {
            return res.status(404).json({ err: 'Comment does not exist.' });
        }
        if (req.user._id.toString() !== comment.commentAuthor.toString()) {
            return res.status(403).json({ err: 'Unauthorized' });
        }
        const { text } = req.body;
        comment.text = text;
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// delete specific comment on specific post
router.delete("/:recipeId/comments/:commentId", verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        const comment = await Comment.findById(req.params.commentId);
        if (!recipe || !comment) {
            return res.status(404).json({ err: 'Comment does not exist.' });
        }
        // check if user is the original poster or the comment author
        if (req.user._id.toString() !== recipe.originalPoster.toString() 
            && req.user._id.toString() !== comment.commentAuthor.toString()) {
            return res.status(403).json({ err: 'Unauthorized' });
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// retrieves all comments
router.get("/comments", verifyToken, async (req, res) => {
    try {
        const comments = await Comment.find({});
        if (!comments) {
            return res.status(404).json({ err: 'No comments found' });
        }
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
