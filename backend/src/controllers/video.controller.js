import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
  uploadVideoToCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";


const publishedVideo = asyncHandler(async (req, res) => {
  //1) verify By JWT authentication
  //2) send Files (Thumbnails and Video) through MULTER as a middleware in the Server
  //3) Other infomation through body -> Title,Description
  const { title, description } = req.body;

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  //4) verify any Empty feilds
  if (title?.trim() === "" || description?.trim() === "") {
    if (videoLocalPath) {
      fs.unlinkSync(videoLocalPath);
    }
    if (thumbnailLocalPath) {
      fs.unlinkSync(thumbnailLocalPath);
    }
    throw new ApiError("Title and Description cannot be Empty!!", 402);
  }

  //5) verify that files reached the server
  //6) by checking local path
  if (!videoLocalPath) {
    throw new ApiError("Somthing Went wrong while uploading the video!! please upload it again", 501);
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(
      "Somthing Went wrong while uploading the Thumbnail!! please upload it again",
      501
    );
  }

  //uploading to cloudinary
  //7) upload the given files to cloudinary


  // const videoFile = await uploadToCloudinary(videoLocalPath);
  const thumbnail = await uploadToCloudinary(thumbnailLocalPath);


  const videoFile = await uploadVideoToCloudinary(videoLocalPath)

  if (!videoFile) {
    throw new ApiError(
      "Somthing Went wrong while uploading the video to Cloudinary!!",
      501
    );
  }
  if (!thumbnail) {
    throw new ApiError(
      "Somthing Went wrong while uploading the thumbnail to Cloudinary!!",
      501
    );
  }

  console.log("Reached here",videoFile);

  //8) Create a Video Document and update the feilds
  const video = await Video.create({
    title,
    description,
    videoFile: videoFile?.url,
    thumbnail: thumbnail?.url,
    //9) from response from cloudinary take out the url and also the Duration of video
    duration: videoFile?.duration,
    owner: req.user?._id,
    isPublished: false,
  });

  if (!video) {
    if (videoFile) {
      await deleteFromCloudinary(videoFile?.url,'video');
    }
    if (thumbnail) {
      await deleteFromCloudinary(thumbnail?.url);
    }
    throw new ApiError("Somthing Went wrong while uploading the video!!", 501);
  }
  //10) Send the response
  return res
    .status(200)
    .json(new ApiResponse(201, video, "Video Published Successfully!!"));
});

const getVideoById = asyncHandler(async (req, res) => {
  //1) verify the access token ->Authentication
  //2) from url->params get the video ID
  const videoId = req.params.videoId;

  const isValidId = mongoose.isValidObjectId(videoId);
  if (!isValidId) {
    throw new ApiError(
      "Invalid Video ID,Please Provide correct video Id!!",
      401
    );
  }
  //3) Search the videoId in the database
  const video = await Video.findByIdAndUpdate(
    videoId,
    {$inc:{views:1}},
    {new:true}
  );

  if (!video) {
    throw new ApiError("Video does not exist!!", 404);
  }

  const getVideoInfo = await Video.aggregate([
    {
      $match:{
        _id:new mongoose.Types.ObjectId(videoId)
      }
    },
    {
      $lookup:{
        from:"users",
        let:{ownerId:"$owner"},
        pipeline:[
          {
            $match:{
              $expr:{
                $eq:["$_id","$$ownerId"]
              }
            }
          },
          //again a lookup in subscription model
          {
            $lookup:{
              from:"subscriptions",
              let:{channelId:"$_id"},
              pipeline:[
                {
                  $match:{
                    $expr:{
                      $eq:["$channel","$$channelId"]
                    }
                  }
                },
                {
                  $group: {
                    _id: null,
                    subscriberCount: { $sum: 1 }
                  }
                }
              ],
              as:"channelSubscribers"
            }
          },
          {
            $unwind:{
              path:"$channelSubscribers",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $addFields: {
              subscribers: { $ifNull: ["$channelSubscribers.subscriberCount", 0] }
            }
          },
          {
            $project:{
              avatar:1,
              username:1,
              fullName:1,
              subscribers:1
            }
          }
        ],
        as:"channelDetails"
      }
    },
    {
      $unwind:{
        path:"$channelDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {  //lookup the like schema
      $lookup:{
        from:"likes",
        let:{videoLikesId:"$_id"},
        pipeline:[
          {
            $match:{
              $expr:{
                $eq:["$video","$$videoLikesId"]
              }
            }
          },//get the counts
          {
            $group: {
              _id: null,
              videoLikes: { $sum: 1 }
            }
          }
          //or do project if not working
        ],
        as:"likesDetails"
      }
    },
    {
      $unwind:{
        path:"$likesDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        likeCount: { $ifNull: ["$likesDetails.videoLikes", 0] }
      }
    },
    {
      $project:{
        likesDetails:1,
        channelDetails:1,
        videoFile:1,
        thumbnail:1,
        title:1,
        description:1,
        duration:1,
        views:1,
        createdAt:1,

      }
    }

  ])
  const addToWatchHistory = await User.updateOne(
    {_id:req.user._id},
    [
      {
        $set:{
          watchHistory:{
            $concatArrays:[
              [new mongoose.Types.ObjectId(videoId)], //to make it at top
              {
                $filter:{
                  input:"$watchHistory",
                  as:"videoId",
                  cond:{
                    $ne:["$$videoId",new mongoose.Types.ObjectId(videoId)]
                  }
                }
              }
            ]
          }
        }
      }
    ]
  )
  if(!addToWatchHistory){
    throw new ApiError("Something went wrong while adding video to watch history",501)
  }
  return res
    .status(200)
    .json(new ApiResponse(201, getVideoInfo[0]?getVideoInfo[0]:getVideoInfo, "Video Fetched Successfully!!!"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  //1) Verify Authentication
  //2) verify videoId correct objectId
  //3) check empty values
  //4) check if thumbnail is send
  //5) get video document from Database
  //6) update title or description
  //7) send response

  const videoId = req.params.videoId;
  const { title, description } = req.body;
  const isValid = mongoose.isValidObjectId(videoId);

  const thumbnailLocalPath = req.file?.path;

  if (!isValid) {
    if (thumbnailLocalPath) {
      fs.unlinkSync(thumbnailLocalPath);
    }
    throw new ApiError("Invalid Video Id", 401);
  }

  if (title?.trim() === "" || description?.trim() === "") {
    if (thumbnailLocalPath) {
      fs.unlinkSync(thumbnailLocalPath);
    }
    throw new ApiResponse("Title or thumbnail cannot be empty!!", 401);
  }

  if (!thumbnailLocalPath) {
    throw new ApiError("Thumbnail is Required!!", 401);
  }

  const video = await Video.findById(videoId);
  if (!video) {
    fs.unlinkSync(thumbnailLocalPath);
    throw new ApiError("Video does not Exist!!", 404);
  }

  //upload to cloudinary
  const newThumbnail = await uploadToCloudinary(thumbnailLocalPath);
  if (!newThumbnail) {
    throw new ApiError("Something went wrong while Uploading Thumbnail!!", 501);
  }

  //update
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: newThumbnail.url,
      },
    },
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiError(
      "Something went wrong while updating the video details!!",
      501
    );
  }

  const oldThumbnail = await deleteFromCloudinary(video?.thumbnail);
  if (!oldThumbnail) {
    throw new ApiError(
      "Something went wrong while deleting the old thumbnail!!",
      501
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, updatedVideo, "Video Details updated Successfully!!")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  //1) verify authentication
  //2) verify VideoId
  //3) check if video Exist by using videoId
  //4) find by id and delete document
  //5) from 3 point in a variable keep thumbnail and video url
  //6) delete from cloudinary

  //still deleting issue in cloudinary

  const videoId = req.params.videoId;

  const isValid = mongoose.isValidObjectId(videoId);
  if (!isValid) {
    throw new ApiError("Invalid video Id!!", 401);
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError("Video does not exist!!!", 404);
  }
  const thumbnail = video?.thumbnail;
  const videoFile = video?.videoFile;

  const deletedVideo = await Video.findByIdAndDelete(videoId);
  if (!deleteVideo) {
    throw new ApiError("Something went wrong while deleting the video!!", 501);
  }

  const delThumb = await deleteFromCloudinary(thumbnail);
  const delVideo = await deleteFromCloudinary(videoFile, "video");

  if (!(delThumb || delVideo)) {
    throw new ApiError(
      "Something went wrong while deleteing the assests from cloudinary!!"
    );
  }

  console.log(deletedVideo);

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Video Deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  //1) verify Authentication
  //2) verify videoId
  //3) check if video exists
  //4) update the toggle if true -> make false if false -> make true

  const videoId = req.params.videoId;
  const isValid = mongoose.isValidObjectId(videoId);
  if (!isValid) {
    throw new ApiError("Invalid video id", 401);
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError("Video does not exist", 404);
  }
  const isPublished = video?.isPublished;
  const toggleVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !isPublished,
      },
    },
    { new: true }
  );
  if (!toggleVideo) {
    throw new ApiError("Something went wrong while toggeling video!!", 501);
  }

  return res
    .status(200)
    .json(new ApiResponse(201, toggleVideo, "Video Toggled Successfully!!!"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const options = {
    page,
    limit,
  };

  const match = {
    //TODO : Use $search operator instead of $regex
    ...(query ? { title: { $regex: query, $options: "i" } } : {}),
    ...(mongoose.isValidObjectId(userId)
      ? { owner: mongoose.Schema.Types.ObjectId(userId) }
      : {}),
  };

  const aggregate = Video.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "users",
        let: { ownerId: "$owner" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", "$$ownerId"] } },
          },
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
        as: "videoOwner",
      },
    },
    {
      $unwind: { path: "$videoOwner", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        views: 1,
        createdAt: 1,
        videoOwner: 1,
      },
    },
    {
      $sort: {
        [sortBy]: sortType === "desc" ? -1 : 1,
      },
    },
  ]);
  ///#######################################################

  //NON LET,PIPEPLINE(NEXTED WAY)
  // const videos = Video.aggregate([
  //   {
  //     $match:match
  //   },
  //   { //TODO : Use the Let,pipeline,match,project wala
  //     $lookup: {
  //       from: "users", // Collection name for users
  //       localField: "owner", // Field in 'videos' collection
  //       foreignField: "_id", // Field in 'users' collection
  //       as: "videoOwner",
  //     },
  //   },
  //   {
  //     $unwind: { path: "$videoOwner", preserveNullAndEmptyArrays: true },
  //   },
  //   {
  //     $project: {
  //       title: 1,
  //       description: 1,
  //       videoFile: 1,
  //       thumbnail:1,
  //       views:1,
  //       createdAt: 1,
  //       videoOwner: {
  //         avatar: "$videoOwner.avatar",
  //         fullName: "$videoOwner.fullName",
  //         username: "$videoOwner.username",
  //       },
  //     },
  //   },
  //   {
  //     $sort:{
  //       [sortBy] : sortType === 'desc' ? -1:1,
  //     }
  //   },
  // ]);

  //#########################################################

  const result = await Video.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(201, result.docs, "Videos Fetched Successfullly!!"));
});

const getChannelVideos =asyncHandler(async(req,res)=>{
  //1) verified auth
  //2) from url we get username 
  //3) verify username
  //4) aggregate all the video document where videoOwner match with userId
  //5) in video ->match channelId with videoOwner
  const channelId = req.params.channelId;
  //check valid id
  if(!mongoose.isValidObjectId(channelId)){
    return ApiError("Invalid channel Id",401)
  }

  const channelVideos = await Video.aggregate([
    {
      $match:{
        owner:new mongoose.Types.ObjectId(channelId)
      }
    }
  ])

  console.log(channelVideos);

  if(!channelVideos){
    return ApiError("Something went wrong while fetching channel videos",503)
  }

  return res.status(200).json(
    new ApiResponse(200,channelVideos,"Channel videos fetched successfully!")
  )
})

export {
  publishedVideo,
  getVideoById,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
  getAllVideos,
  getChannelVideos
};
