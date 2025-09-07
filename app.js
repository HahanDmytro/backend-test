require("dotenv").config();
require("./db/connectDB");
const bodyParser = require('body-parser');

const express = require("express");
const cors = require("cors");

const auth = require("./routers/auth.js");
const post = require('./routers/post.js');
const image = require("./routers/image.js");

const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', auth);
app.use('/api/v2', post);
app.use('/api/v3', image)

app.listen(port, () => {
    console.log(`The server running in : ${port}`);
});