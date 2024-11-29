require("dotenv")
const mongoose = require("mongoose");


const connectDB = async (req, res) => {
    try {
        await mongoose
            .connect(process.env.MONGO_URL)
            .then(() => {
                console.log("Connected to Database")
            })
    
    } catch (error) {
        res.send(400).json({
            message: "Not Connected to DB"
        });    
    }
};

connectDB();