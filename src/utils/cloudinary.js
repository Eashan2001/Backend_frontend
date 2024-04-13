import { v2 as cloudinary } from "cloudinary"; // Importing Cloudinary v2 SDK
import fs from "fs"; // Importing Node.js filesystem module

// Configure Cloudinary with API credentials
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Define the function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Check if the localFilePath is provided
        if (!localFilePath) return null;

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Set resource type to auto-detect
        });

        // Log success message and return the response object containing details about the uploaded file
        console.log("File uploaded successfully:", response.url);
        return response;
    } catch (error) {
        // If an error occurs during upload, delete the locally saved temporary file and return null
        fs.unlinkSync(localFilePath); // Delete the locally saved temporary file
        return null;
    }
}

// Export the function to be used in other modules
export { uploadOnCloudinary };
