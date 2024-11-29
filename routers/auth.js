const router = require("express").Router();
const Admin = require('../models/Admin.js');
const bcrypt = require('bcryptjs')

router.post('/reqister', async (req, res) => {
    try {
        const {email, usename, password} = req.body;
        const hashpassword = bcrypt.hashSync(password);
        const admin = new Admin({ email, usename, password: hashpassword });
        await admin.save().then(() => {
            res.status(200).json({ admin });
        })
    } catch (error) {
        res.stauts(200).json({ message: "Admin whith this usename is exist" });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        if (!admin) {
            res.status(400).json({ message: "Registred before" });
        }

        const isCorrectPassword = bcrypt.compareSync(
            req.body.password,
            admin.password
        );
        if (!isCorrectPassword) {
            res.status(400).json({ message: "The password inCorrect" });
        }
        const { password, ...others } = admin._doc;
        res.stauts(200).json({ others });
    } catch (error) {
        res.status(400).json({ message: 'User Already exist' })
    }
});

module.exports = router;