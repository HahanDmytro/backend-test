require("dotenv")
const mongoose = require("mongoose");


const connectionDB = async (req, res) => {
    try {
        const connection = await mongoose
            .connect(process.env.MONGO_URL);
        console.log(`Connected to mongoDB ${connection.connection.host}`)
    } catch (error) {
        console.error(error);
    }
};

connectionDB();