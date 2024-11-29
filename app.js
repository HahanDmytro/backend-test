require("dotenv").config();
require("./db/connectDB");

const express = require("express");
const auth = require("./routers/auth.js");
const post = require('./routers/post.js');

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/api/v1', auth);
app.use('/api/v2', post);

app.listen(port, () => {
    console.log(`The server running in : ${port}`);
});