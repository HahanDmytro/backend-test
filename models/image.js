const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: String,
    post: [{
        type: mongoose.Types.ObjectId,
        ref: "Post"
    }],
    author: [{
        type: mongoose.Types.ObjectId,
        ref: "Admin"
    }]

});

module.exports = mongoose.model("Image", ImageSchema);
