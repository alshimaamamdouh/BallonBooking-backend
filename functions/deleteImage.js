const cloudinary = require('cloudinary').v2;
require('dotenv').config();  

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000, // Set Cloudinary timeout to 60 seconds
});
const deleteImage = async (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject({ message: 'Cloudinary deletion failed', error });
            } else {
                resolve({ message: 'Image deleted successfully', result });
            }
        });
    });
};

module.exports = deleteImage;
