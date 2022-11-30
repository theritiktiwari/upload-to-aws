const express = require("express");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const fetchUser = require("../middleware/fetchUser");
const User = require('../model/users');
const Image = require('../model/images');

// Initialize AWS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: 'v4',
    region: process.env.AWS_REGION
});

// Create a storage
const storage = multer.memoryStorage({
    acl: "public-read",
    destination: (req, file, callback) => {
        callback(null, '');
    }
});

// Function to upload image to S3 bucket
const upload = multer({ storage }).single('image');

// ROUTE 1 - Upload a image in S3 bucket with endpoint (POST : '/upload').
router.post("/upload", fetchUser, upload, async (req, res) => {
    try {
        // Check if file is present or not
        if (!req.file)
            return res.status(400).json({
                type: "error",
                message: "No file selected"
            });

        //  Give unique name to the file
        let file = req.file.originalname.split(".");
        const fileType = file[file.length - 1];
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${uuidv4()}.${fileType}`,
            Body: req.file.buffer,
        }

        // Upload file to S3 bucket
        s3.upload(params, async (error, data) => {
            if (error)
                return res.status(500).json({
                    type: "error",
                    message: "Error in uploading."
                });

            // Get the public url of the file
            const url = s3.getSignedUrl('getObject', {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: data.Key
            });

            // Save the image in database
            await Image.create({
                name: data.Key,
                link: url,
                user_id: req.user.id,
            });

            res.status(200).json({
                type: "success",
                message: "Image uploaded successfully",
                data: data
            });
        })

    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// ROUTE 2 - Show the image to the respective user with endpoint (POST : '/images')
router.post('/images', fetchUser, async (req, res) => {
    try {
        // Fetch all the images uploaded by the user
        const imagesList = await Image.find({ user_id: req.user.id });
        if (imagesList.length === 0)
            return res.status(400).json({
                type: "error",
                message: "No images found"
            });
        res.status(200).json({
            type: "success",
            message: "Images fetched successfully",
            data: imagesList
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// ROUTE 3 - Show the particular image with image ID with endpoint (POST : '/:id')
router.post('/image/:id', fetchUser, async (req, res) => {
    try {
        // Check if the ID is provided or not
        if (!req.params.id)
            return res.status(400).json({
                type: "error",
                message: "No image ID found"
            });

        // Check if the ID is valid or not
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({
                type: "error",
                message: "Invalid image ID"
            });

        // Find the image with the ID and user ID
        const image = await Image.find({ user_id: req.user.id, _id: req.params.id });
        if (image.length === 0)
            return res.status(400).json({
                type: "error",
                message: "No image found"
            });

        res.status(200).json({
            type: "success",
            message: "Image fetched successfully",
            data: image
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
            message: err.message
        });
    }
});

module.exports = router;