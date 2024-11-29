require("dotenv").config();

const express = require("express");
require("./db/connectDB");

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`The server running in : ${port}`);
});