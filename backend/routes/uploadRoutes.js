const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const router = express.Router();

require("dotenv").config();

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({storage});
router.post("/", upload.single("image"), async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"});
        }

        //function to upload to cloudinary
        const uploadToCloudinary = async(file)=>{
            return new Promise((resolve,reject)=>{
                const uploadStream = cloudinary.uploader.upload_stream({
                    resource_type: "auto",
                },(error,result)=>{
                    if(error){
                        reject(error);
                    }else{
                        resolve(result);
                    }
                });

                //use streamifier to convert buffer to stream
                streamifier.createReadStream(file).pipe(uploadStream);
            });
        };

        //call the stream upload function
        const result = await uploadToCloudinary(req.file.buffer);
        //respond with the uploaded image url
        res.json({imageUrl:result.secure_url});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});
module.exports = router;

