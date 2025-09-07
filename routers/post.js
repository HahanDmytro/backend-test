const router = require("express").Router();
const Post = require("../models/post.js");
const Image = require("../models/image.js");
const Admin = require("../models/Admin.js");
const multer = require('multer');
const { storage } = require('../db/connectImg.js');
const cloudinary = require('cloudinary').v2;

const upload = multer({ storage });

//created posts
router.post('/addPost', async (req, res) => {
    try {
        
        const { id, title, body } = req.body;
        const AdminExist = await Admin.findById(id);
        if (AdminExist) {
            const post = new Post({ title, body, author: AdminExist});
            await post.save().then(() => {
                res.status(200).json({ post })
            });
            AdminExist.post.push(post);
            AdminExist.save();
            
        } else {
            res.status(404).json({message: "Admin is not Exist"});
        }
    } catch (error) {
        res.status(200).json({message: "post didn't save"});
    }
    
});

// all the posts
router.get('/allPost', async (req, res) => {
    try {
        const posts = await Post.find({})
            .sort({createdAt: -1})
            .populate("image", "url");

        res.status(200).json({posts});
    } catch (error) {
        res.status(200).json({ message: "Note Exist Posts" })
    }
});

// update post
router.put('/updatePost/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, body } = req.body;
        const post = await Post.findByIdAndUpdate(req.params.id, {title:title, body:body}, {new: true});
        await post.save().then(() => {
            res.status(200).json({ message: 'The post is changed', post });
        });
    } catch (error) {
        res.status(200).json({ message: "The post is not changed" })
        console.log(error);
    }
});

// delete post
router.delete('/deletePost/:id', async (req, res) => {
    
    try {
        const { id } = req.body;
        const AdminExist = await Admin.findByIdAndUpdate(
            id, 
            {$pull: {post: req.params.id}}
        );

        if (AdminExist) {
            const Images = await Image.find({post: req.params.id});

            if (!Images || Images.length === 0) {
                await Post.findByIdAndDelete(req.params.id).then(() => {
                    res.status(200).json({ message: "The post is deleted" });
                });
            } else {
                const deleteImages = Images.map(async (image) => {
                try{
                    const urlParts = image.url.split('/');
                    const fileNameWithExtension = urlParts[urlParts.length - 1];
                    const folderPath = urlParts.slice(urlParts.length - 2, urlParts.length -1);
                    const fileName = fileNameWithExtension.split('.')[0];
                    const publicId = `${folderPath}/${fileName}`;

                    await cloudinary.uploader.destroy(publicId);
                    await Post.findByIdAndDelete(req.params.id).then(() => {
                        res.status(200).json({ message: "The post is deleted" });
                    });
                } catch (error) {
                    res.status(200).json({messages: "problem is deleted and images too"})
                }});
                await Deletion.all(deleteImages);
            }
            
        }
        
    } catch (error) {
        res.json({ success: true });
        console.log(error)
    }
});

module.exports = router;
