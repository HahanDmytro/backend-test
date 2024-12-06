const router = require("express").Router();
const Post = require("../models/post.js");
const Admin = require("../models/Admin.js");
const multer = require('multer');
const { storage } = require('../db/connectImg.js');
const cloudinary = require('cloudinary').v2;

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
router.put('/updatePost/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, body } = req.body;
        const oldPost = await Post.findById(req.params.id);
        if (!oldPost) {
            res.status(404).json({ message: "The post didn't find" })
        } 
        // If new image upload
        console.log(req.file);
        if (req.file?.path && oldPost.imageUrl) {

            const urlParts = oldPost.imageUrl.split('/');
            const fileNameWithExtension = urlParts[urlParts.length - 1];
            const folderPath = urlParts.slice(urlParts.length - 2, urlParts.length -1);
            const fileName = fileNameWithExtension.split('.')[0];
            const publicId = `${folderPath}/${fileName}`;

            await cloudinary.uploader.destroy(publicId);
        }
        const updatePost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title: title || oldPost.title,
                body: body || oldPost.body,
                imageUrl: req.file?.path || oldPost.imageUrl,
            },
            {new: true},
        )
        res.status(200).json({ message: 'The post is changed', post: updatePost });
        
    } catch (error) {
        res.status(200).json({ error })
    }
});

// delete post
router.delete('/deletePost/:id', async (req, res) => {
    try {
        const { id } = req.body;
        const AdminExist = await Admin.findByIdAndUpdate( id, {
            $pull: {post: req.params.id}
        });
        const oldPost = await Post.findById(req.params.id);

        if (AdminExist) {
            if (oldPost.imageUrl) {

                const urlParts = oldPost.imageUrl.split('/');
                const fileNameWithExtension = urlParts[urlParts.length - 1];
                const folderPath = urlParts.slice(urlParts.length - 2, urlParts.length -1);
                const fileName = fileNameWithExtension.split('.')[0];
                const publicId = `${folderPath}/${fileName}`;

                await cloudinary.uploader.destroy(publicId);
            }
            await Post.findByIdAndDelete(req.params.id).then(() => {
                res.status(200).json({ message: "The post is deleted" });
            });
        }
        
    } catch (error) {
        res.status(200).json({ message: "The post is not deleted" });
    }
});

module.exports = router;
