const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        image: [
            {
                type:mongoose.Types.ObjectId,
                ref: "Image",
            },
        ],
        author: [
            {
                type:mongoose.Types.ObjectId,
                ref: "Admin",
            },
        ],
    },
    {timestamps: true}
);

module.exports = mongoose.model("Post", PostSchema);