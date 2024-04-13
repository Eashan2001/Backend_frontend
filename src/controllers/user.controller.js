import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    // Validate required fields
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Check if avatar file is provided
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Upload avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Error uploading avatar file");
    }

    // Upload cover image to Cloudinary (if needed)
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    // Create user in database
    const newUser = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage ? coverImage.url : null, // Use cover image URL if available
        password,
    });

    // Fetch user data without sensitive information
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    // Handle user creation errors
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    // Return success response
    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
