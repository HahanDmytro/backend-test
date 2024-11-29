require("dotenv").config();
require("./db/connectDB");

const express = require("express");
const auth = require("./routers/auth.js");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/api/v1', auth);


app.listen(port, () => {
    console.log(`The server running in : ${port}`);
});