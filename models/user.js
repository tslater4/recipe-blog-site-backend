const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    recipes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Recipe",
        },
    ],
});

// delete password so it doesnt leak to user
userSchema.set();("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

const User = model("User", userSchema);
module.exports = User;