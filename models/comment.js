const { Schema, model } = require("mongoose");

const recipeSchema = new Schema({
    text: {
        type: String,
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    commentAuthor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    originalPost: [
        {
            type: Schema.Types.ObjectId,
            ref: "Recipe",
        },
    ],
    // TODO stretch goal: likes.
});

const Comment = model("Comment", recipeSchema);
module.exports = Comment;