require("dotenv").config();
const router = require("express").Router();
const Admin = require('../models/Admin.js');
const bcrypt = require('bcryptjs');

const secretPassword = bcrypt.hashSync(process.env.SECRET_PASSWORD);

router.post('/reqister', async (req, res) => {
    try {
        const {email, usename, password, serverpassword} = req.body;
        const isSecretPassword = await bcrypt.compare(
            req.body.serverpassword,
            secretPassword
        );
        if (!isSecretPassword) {
            return res.status(401).json({ message: "The server password is incorrect" });
        } else {
            const hashpassword = bcrypt.hashSync(password);
            const admin = new Admin({ email, usename, password: hashpassword });
            await admin.save().then(() => {
                res.status(200).json({ admin });
            });
        }
    } catch (error) {
        res.stauts(200).json({ message: "Admin whith this usename is exist" });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        if (!admin) {
            return res.status(404).json({ message: "Registred before" });
        }

        const isCorrectPassword = await bcrypt.compare(
            req.body.password,
            admin.password
        );
        if (!isCorrectPassword) {
            return res.status(401).json({ message: "The password inCorrect" });
        }
        const { password, ...others } = admin._doc;
        return res.status(200).json({ others });
    } catch (error){
        res.status(500).json(error)
        console.error(error);
    }
});

module.exports = router;