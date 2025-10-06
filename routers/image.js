const router = require('express').Router();
const Post = require('../models/post.js');
const Image = require('../models/image.js')
const Admin = require('../models/Admin.js');
const multer = require('multer');
const { storage } = require('../db/connectImg.js');
const cloudinary = require('cloudinary').v2;

const upload = multer({storage});

router.post('/addImage/:id', upload.single('image'), async (req, res) => {
    try {
        const {id} = req.body;
        const AdminExist = await Admin.findById(id);
        const PostExist = await Post.findById(req.params.id);
        if (AdminExist) {
            const image = new Image({
                url: req.file.path || '',
                author: AdminExist,
                post: PostExist,
            });
            await image.save();
            AdminExist.image.push(image);
            await AdminExist.save();
            PostExist.image.push(image);
            await PostExist.save();
            return res.status(201).json({ image })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: true })
    }
});
//getImages
// all the posts
router.get('/getImages/:id', async (req, res) => {
    try {
        const images = await Image.find({post: req.params.id});
            

        res.status(200).json({images});
    } catch (error) {
        res.json({ succcess: true })
    }
});

router.delete('/deleteImage/:id', async (req, res) => {
    try {
        const {id, postId} = req.body;
        const AdminExist = await Admin.findByIdAndUpdate(
            id,
            {$pull: {image: req.params.id}}
        );
        const PostExist = await Post.findByIdAndUpdate(
            postId,
            {$pull: {image: req.params.id}}
        );
        const ImageDel = await Image.findById(req.params.id)
        if (AdminExist && PostExist) {
            const urlParts = ImageDel.url.split('/');
            const fileNameWithExtension = urlParts[urlParts.length - 1];
            const folderPath = urlParts.slice(urlParts.length - 2, urlParts.length -1);
            const fileName = fileNameWithExtension.split('.')[0];
            const publicId = `${folderPath}/${fileName}`;

            await cloudinary.uploader.destroy(publicId);
            await Image.findByIdAndDelete(req.params.id).then(() => {
                res.status(200).json({ message: "The image was deleted" })
            });
        }
    } catch (error) {
        res.json({ success: true })
        console.log(error);
    }
});


module.exports = router;