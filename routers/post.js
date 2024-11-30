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

// all the posts
router.get('/allPost', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({posts});
    } catch (error) {
        res.status(200).json({ message: "Note Exist Posts" })
    }
});

// update post
router.put('/updatePost/:id', async (req, res) => {
    try {
        const { title, body } = req.body;
        const post = await Post.findByIdAndUpdate(req.params.id, {title, body});
        post.save().then(() => res.status(200).json({post}))
    } catch (error) {
        res.status(200).json({ message: "Something wrong" })
    }
});

// delete post
router.delete('/deletePost/:id', async (req, res) => {
    try {
        const { email } = req.body;
        const AdminExist = await Admin.findOneAndUpdate({ email }, {
            $pull: {post: req.params.id}
        });
        if (AdminExist) {
            await Post.findByIdAndDelete(req.params.id).then(() => {
                res.status(200).json({ message: "The post is deleted" });
            });
        }
        
    } catch (error) {
        res.status(200).json({ message: "The post is not deleted" });
    }
});

module.exports = router;
