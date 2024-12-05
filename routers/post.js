const router = require("express").Router();
const Post = require("../models/post.js");
const Admin = require("../models/Admin.js");
const multer = require('multer');
const { storage } = require('../db/connectImg.js');

const upload = multer({ storage });

//created posts
router.post('/addPost', upload.single('image'), async (req, res) => {
    try {
        
        const { id, title, body } = req.body;
        const AdminExist = await Admin.findById(id);
        if (AdminExist) {
            const post = new Post({ title, body, author: AdminExist, imageUrl: req.file.path || ''});
            await post.save().then(() => res.status(200).json({ post }));
            AdminExist.post.push(post);
            AdminExist.save();
            
        } else {
            res.status(200).json({message: "Admin is not Exist"});
        }
    } catch (error) {
        res.status(200).json({message: "post didn't save"});
    }
    
});

// all the posts
router.get('/allPost', async (req, res) => {
    try {
        const posts = await Post.find({}).sort({createdAt: -1});
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
        const { id } = req.body;
        const AdminExist = await Admin.findByIdAndUpdate( id, {
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
