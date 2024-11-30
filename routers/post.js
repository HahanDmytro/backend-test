const router = require("express").Router();
const Post = require("../models/post.js");
const Admin = require("../models/Admin.js");

//created posts
router.post('/addPost', async (req, res) => {
    try {
        const { email, title, body } = req.body;
        const AdminExist = await Admin.findOne({email});
        if (AdminExist) {
            const post = new Post({ title, body, author: AdminExist });
            await post.save().then(() => res.status(200).json({ post }));
            AdminExist.post.push(post);
            AdminExist.save();
            
        } else {
            res.status(200).json({message: "Amin is not Exist"});
        }
    } catch (error) {
        res.status(200).json({message: "post didn't save"});
    }
    
});

router.get('/allPost', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({posts});
    } catch (error) {
        res.status(200).json({ message: "Note Exist Posts" })
    }
});

module.exports = router;
