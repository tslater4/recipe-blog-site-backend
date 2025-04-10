const { Schema, model } = require("mongoose");

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    body: {
        type: String,
        required: true, // could split into multiple things but lets not overthink this until its future me's turn
    },
    image: {
        type: Buffer, // images will be directly in database
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    originalPoster: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    // stretch goal: likes.
});

const Recipe = model("Recipe", recipeSchema);
module.exports = Recipe;