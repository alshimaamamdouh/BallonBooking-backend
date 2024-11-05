const cloudinary = require('cloudinary').v2;
require('dotenv').config();  

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000, // Set Cloudinary timeout to 60 seconds
});

const updateImage = async (publicId, fileBuffer) => {
    return new Promise((resolve, reject) => {
        // First, delete the old image
        cloudinary.uploader.destroy(publicId, (deleteError, deleteResult) => {
            if (deleteError) {
                reject({ message: 'Failed to delete old image', error: deleteError });
                return;
            }

            // Then, upload the new image
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

module.exports = updateImage;
