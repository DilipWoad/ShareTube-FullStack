import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //1)verify authentication
  //2)get videoId from params
  //3)validated videoId
  //4)check if video exists
  //5)now check current user Id present and videoId present in the like schema
  //6)if present delete the document from the collection
  //7)if not present Create a document with videoId and LikeBy feilds

  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError("Invalid Video Id", 401);
  }

  const isVideoExists = await Video.findById(videoId);
  if (!isVideoExists) {
    throw new ApiError("Video does not exists", 404);
  }

  const isVideoLikedAlready = await Like.findOne({
    video: videoId,
    likeBy: req.user._id,
  });

  if (isVideoLikedAlready) {
    //delete
    await Like.findByIdAndDelete(isVideoLikedAlready._id);

    return res
      .status(200)
      .json(new ApiResponse(201, {}, "Removed Like from Video Successfully"));
  }
  const like = await Like.create({
    video: videoId,
    likeBy: req.user._id,
  });

  if (!like) {
    throw new ApiError("Something went wrong while Liking the video", 501);
  }

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Liked the Video Successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //1)verify authentication
  //2)get videoId from params
  //3)validated videoId
  //4)check if video exists
  //5)now check current user Id present and videoId present in the like schema
  //6)if present delete the document from the collection
  //7)if not present Create a document with videoId and LikeBy feilds

  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError("Invalid Comment Id", 401);
  }

  const isCommentExists = await Comment.findById(commentId);
  if (!isCommentExists) {
    throw new ApiError("Comment does not exists", 404);
  }

  const isCommentLikedAlready = await Like.findOne({
    comment: isCommentExists._id,
    //   likeBy: req.user._id,
  });

  if (isCommentLikedAlready) {
    //delete
    await Like.findByIdAndDelete(isCommentLikedAlready._id);

    return res
      .status(200)
      .json(new ApiResponse(201, {}, "Removed Like from Comment Successfully"));
  }
  const like = await Like.create({
    comment: commentId,
    //   likeBy: req.user._id,
  });

  if (!like) {
    throw new ApiError("Something went wrong while Liking the Comment", 501);
  }

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Liked the Comment Successfully"));
});

const togglePostLike = asyncHandler(async (req, res) => {
  //1)verify authentication
  //2)get videoId from params
  //3)validated videoId
  //4)check if video exists
  //5)now check current user Id present and videoId present in the like schema
  //6)if present delete the document from the collection
  //7)if not present Create a document with videoId and LikeBy feilds

  const { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError("Invalid Post Id", 401);
  }

  const isPostExists = await Post.findById(postId);
  if (!isPostExists) {
    throw new ApiError("Post does not exists", 404);
  }

  const isPostLikedAlready = await Like.findOne({
    post: isPostExists._id,
    likeBy: req.user._id,
  });

  if (isPostLikedAlready) {
    //delete
    await Like.findByIdAndDelete(isPostLikedAlready._id);

    return res
      .status(200)
      .json(new ApiResponse(201, {}, "Removed Like from Post Successfully"));
  }
  const like = await Like.create({
    post: postId,
      likeBy: req.user._id,
  });

  if (!like) {
    throw new ApiError("Something went wrong while Liking the Post", 501);
  }

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Liked the Post Successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const video = await Like.aggregate([
    {
      $match: {
        likeBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        let: { videoId: "$video" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$videoId" ],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              let: { ownerId: "$owner" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$ownerId"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    username: 1,
                    avatar: 1,
                    fullName: 1,
                  },
                },
              ],
              as: "videoOwner",
            },
          },
          {
            $unwind: {
              path: "$videoOwner",
            },
          },
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              title: 1,
              videoOwner: 1,
              views: 1,
              createdAt: 1,
            },
          },
        ],
        as: "videoDetail",
      },
    },
    {
      $unwind: {
        path: "$videoDetail",
      },
    },
    {
      $project: {
        _id:0,
        videoDetail:1,
      },
    },
  ]);

  if (!video) {
    throw new ApiError("Something went wrong while fetching Liked Videos", 501);
  }

  return res.status(200).json(
    new ApiResponse(
      201,
      video, //video or video[0]-> this is wrong it will only give the one video(i.e is arr[0]postion i was so stuck on  this one bruh)
      "User's Liked Video Fetched Successfully!!"
    )
  );
});

const isLikedAlready = asyncHandler(async (req, res) => {
  //verify authentication
  //get userId from req.user
  // we will get videoId from the frontent params
  // get videoId
  // verify videoID
  // check if video Exist
  // just do a findOne in Like model with video->videoId and likedBy->userId

  const currentUserId = req.user._id;

  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError("Invalid Video Id", 401);
  }

  const isVideExists = await Video.findById(videoId);
  if (!isVideExists) {
    throw new ApiError("Video does not Exists", 404);
  }

  //now find in like schema
  const isVideoLikedAlreadyByUser = await Like.findOne({
    video: new mongoose.Types.ObjectId(videoId),
    likeBy: new mongoose.Types.ObjectId(currentUserId),
  });
  if (isVideoLikedAlreadyByUser === null) {
    return res
      .status(200)
      .json(new ApiResponse(200, false, "User has not liked the video"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, true, "User has already Liked the video"));
});

const isUserAlreadyLikeThePost = asyncHandler(async(req,res)=>{
  //1) validate the user authentication
  //2) if valid then check if it's valid objId ->postId
  //3) check in liked model and match the document that contains post field with this id and has likeBy field with the current userId
  //4) if present then it's return true
  //5) if not present then return false
  
  const currentUserId = req.user._id;
  const {postId}= req.params;

  if(!mongoose.isValidObjectId(postId)){
    throw new ApiError("Invalid post Id",403)
  }

  //check if post exist or not
  const isPostExists=await Post.findById(postId);
  if(!isPostExists){
    throw new ApiError("Post does not Exists",404);
  }

  //now check in like model
  const isPostAlreadyLikeByUser=await Like.findOne({
    post:postId,
    likeBy:currentUserId
  })

  if(!isPostAlreadyLikeByUser){
    return res.status(200).json(
      new ApiResponse(200,false,"User has not liked the post")
    )
  }
  return res.status(200).json(
    new ApiResponse(200,true,"User has liked this post Aleady")
  )
})


export {
  toggleVideoLike,
  toggleCommentLike,
  togglePostLike,
  getLikedVideos,
  isLikedAlready,
  isUserAlreadyLikeThePost
};
