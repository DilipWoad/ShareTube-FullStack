import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import {v2 as cloudinary} from "cloudinary"

const healthcheck = asyncHandler(async(req,res)=>{
    //ig we dont need authentication

    const dbstate = mongoose.connection.readyState ===1 ? "Connected" :"Disconnected";

    let cloudinaryState = "Unavailable";

    try {
        await cloudinary.api.ping();
        cloudinaryState = "Available"
    } catch (error) {
        console.error("Cloudinary Health Check Failed:", error.message);
        throw new ApiError(error.message,501)
    }

    return res.status(200).json(
        new ApiResponse(
            201,
            {
                database : dbstate,
                cloudinary : cloudinaryState
            },
            "Everything working Smoothly!!"
        )
    )
})

export {healthcheck};