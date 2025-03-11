import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";

const getChannelStats =asyncHandler(async(req,res)=>{
    //get total views from all the videos,total subscribers,total number of videos,total likes
    //to get total views
    //match owner field in Video and get all video document
    //from received document count document -> this will give total no of video
    //from each document sum the videos field -> this will give total views
    //for total likes search in Like schema with videoId it will give all the document with that 
    //then count it

    //1)Verify Authentication
    const userId = req.user._id;

    const totalNoOfVideos = await Video.countDocuments({
        owner:userId
    })

    const totalViews = await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group:{_id:null,totalNoOfViews:{$sum:"$views"}}
        }
    ])

    const totalSubscriber = await Subscription.countDocuments({
        channel:userId
    })

    const totalLikes = await Like.countDocuments(
        {
            video:{$in : await Video.find({owner:userId}).distinct("_id")}
        }
    )
    return res.status(200).json(
        new ApiResponse(
            201,
            {
                totalNoOfVideos,
                totalLikes,
                totalSubscriber,
                totalViews : totalViews.length ? totalViews[0].totalNoOfViews : 0,
            },
            "Channel Stats Fetched Successfully!!"
        )
    )
})

const getChannelVideos = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    const videos = await Video.find({
        owner:userId
    }).sort({
        createdAt:-1
    })

    //do lookup if it's for other user videos
    //but this is for current user's channel
    if(!videos){
        throw new ApiError("Something went wrong while fetching users videos!!",501)
    }

    return res.status(200).json(
        new ApiResponse(
            201,
            videos,
            "User's videos fetched successfully"
        )
    )

})
export {getChannelStats,getChannelVideos}