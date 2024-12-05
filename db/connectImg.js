require('dotenv');
const cloudinary = require('cloudinary').v2;
const cloudinaryStorage = require('multer-storage-cloudinary');

// Cloudinary config
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const storage = new cloudinaryStorage({
    cloudinary:cloudinary,
    params: {
        folder: 'uploads',
        allowed_format: ['png', 'jpg', 'jpeg'],
    },

});

module.exports = { storage, cloudinary };