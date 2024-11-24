const cloudinary = require('cloudinary').v2;
require('dotenv').config();  

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000, 
});

// single
const updateSingleImage = async (publicId, fileBuffer) => {
    return new Promise((resolve, reject) => {
        // delete old one
        cloudinary.uploader.destroy(publicId, (deleteError, deleteResult) => {
            if (deleteError) {
                reject({ message: 'Failed to delete old image', error: deleteError });
                return;
            }

            // upload new image
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'uploads' },
                (uploadError, uploadResult) => {
                    if (uploadError) {
                        reject({ message: 'Cloudinary upload failed', error: uploadError });
                    } else {
                        resolve({ imageUrl: uploadResult.secure_url, public_id: uploadResult.public_id });
                    }
                }
            );
            uploadStream.end(fileBuffer);
        });
    });
};

// multiple
const updateMultipleImages = async (publicIds, fileBuffers) => {
    // delete old ones
    await Promise.all(publicIds.map(publicId => 
        new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (deleteError) => {
                if (deleteError) {
                    reject({ message: 'Failed to delete old image', error: deleteError });
                } else {
                    resolve();
                }
            });
        })
    ));

    // upload new ones
    const uploadPromises = fileBuffers.map(fileBuffer => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'uploads' },
                (uploadError, uploadResult) => {
                    if (uploadError) {
                        reject({ message: 'Cloudinary upload failed', error: uploadError });
                    } else {
                        resolve({ imageUrl: uploadResult.secure_url, public_id: uploadResult.public_id });
                    }
                }
            );
            uploadStream.end(fileBuffer);
        });
    });

    return await Promise.all(uploadPromises);
};

module.exports = {
    updateSingleImage,
    updateMultipleImages
};
