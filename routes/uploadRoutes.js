const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();  

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000, // Set Cloudinary timeout to 60 seconds
});

// Multer with Memory Storage to upload files directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for single image upload
router.post('/', upload.single('imageUrl'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Create a stream to upload the image to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'uploads' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.status(500).json({ message: 'Cloudinary upload failed', error });
                }

                // Return both secure URL and public ID
                return res.status(200).json({ imageUrl: result.secure_url, public_id: result.public_id });
            }
        );

        uploadStream.end(req.file.buffer);
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Route for multiple image uploads
router.post('/upload-multiple', upload.array('imageUrls', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const imageUploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'uploads' },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary Upload Error:', error);
                            reject(error);
                        } else {
                            resolve({ imageUrl: result.secure_url, public_id: result.public_id });
                        }
                    }
                );
                uploadStream.end(file.buffer);
            });
        });

        const uploadResults = await Promise.all(imageUploadPromises);
        const imageUrls = uploadResults.map(result => result.imageUrl);
        const public_ids = uploadResults.map(result => result.public_id);

        return res.status(200).json({ imageUrls, public_ids });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});





module.exports = router;
