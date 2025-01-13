require("dotenv").config();
require("./db/connectDB");
const bodyParser = require('body-parser');

const express = require("express");
const cors = require("cors");

const auth = require("./routers/auth.js");
const post = require('./routers/post.js');
const payment = require('./routers/donate.js') 

const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(cors({ origin: process.env.LINK_FRONTEND}));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("<h1>Wellcom to page</h1>")
})
app.use('/api/v1', auth);
app.use('/api/v2', post);
app.use('/api/v3', payment);

app.listen(port, () => {
    console.log(`The server running in : ${port}`);
});