const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    author: [
        {
            type:mongoose.Types.ObjectId,
            ref: "Admin",
        },
    ],
});

module.exports = mongoose.model("Post", PostSchema);