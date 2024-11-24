const cloudinary = require('cloudinary').v2;
require('dotenv').config();  

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000, // Set Cloudinary timeout to 60 seconds
});

// single
const deleteSingleImage = async (publicId) => {
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

// multiple
const deleteMultipleImages = async (publicIds) => {
    const deletionPromises = publicIds.map(publicId => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject({ message: 'Cloudinary deletion failed', error });
                } else {
                    resolve({ message: 'Image deleted successfully', result });
                }
            });
        });
    });

    return await Promise.all(deletionPromises);
};

module.exports = {
    deleteSingleImage,
    deleteMultipleImages
};
