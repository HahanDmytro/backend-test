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
        imageUrl : {
            type: String,
            require: true,
        }
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