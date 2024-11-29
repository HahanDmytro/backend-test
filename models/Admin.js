const mongoose = require("mongoose");

const AdminSchema = new  mongoose.Schema({
    usename: {
        type: String,
        unique: true,
    },
    email:{
        type: String,
        require: true,
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Admin", AdminSchema);