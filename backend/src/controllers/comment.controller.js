import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";

const addVideoComment = asyncHandler(async (req, res) => {
  //1) verify authentication
  //2) check videoId is valid
  //3) does videoId present in the database
  //4) check is comment content is empty

  const { videoId } = req.params;
  const { content } = req.body;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError("Invalid Video Id!!", 401);
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError("Video does not Exists!!", 404);
  }

  if (content?.trim() === "") {
    throw new ApiError("Comment cannot be Empty!!", 401);
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  if (!comment) {
    throw new ApiError("Something went Wrong while Adding a comment", 501);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, comment, "Comment added to the video Successfully!!")
    );
});

const addPostComment = asyncHandler(async (req, res) => {
  //1) verify authentication
  //2) check videoId is valid
  //3) does videoId present in the database
  //4) check is comment content is empty

  const { postId } = req.params;
  const { content } = req.body;

  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError("Invalid Post Id!!", 401);
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError("Post does not Exists!!", 404);
  }

  if (content?.trim() === "") {
    throw new ApiError("Comment cannot be Empty!!", 401);
  }

  const comment = await Comment.create({
    content,
    post: postId,
    owner: req.user._id,
  });

  if (!comment) {
    throw new ApiError("Something went Wrong while Adding a comment", 501);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, comment, "Comment added to the Post Successfully!!")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError("Invalid Comment Id!!", 401);
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError("Comment does not exists", 404);
  }

  if (content.trim() === "") {
    throw new ApiError("Content can't be empty", 401);
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError("Something went wrong while updating the comment", 501);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, updatedComment, "Comment Updated Successfully!!")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError("Invalid Comment Id!!", 401);
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError("Comment does not exists", 404);
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new ApiError("Something went wrong while deleting the comment", 501);
  }

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Comment deleted Successfully!!"));
});

const getVideoComments = asyncHandler(async (req, res) => {
  //1) verify authentication
  //2) get page and limit from query
  //3) verify videoId
  //4) check if video exist
  //5) lookup in comment document with video->videoId
  //6) also get the owner-> avatar,fullname and username

  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError("Invalid Video Id", 401);
  }

  const videoExist = await Video.findById(videoId);

  if (!videoExist) {
    throw new ApiError("Video does not exists!!!", 404);
  }

  const commentAggregate = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
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
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
        as: "commentOwner",
      },
    },
    {
      $unwind:{
        path:"$commentOwner"
      }
    },
    //as we have all the documents with the videoId so just group and sum to get the count of document
    {
      $setWindowFields:{
        partitionBy:"$video",
        output:{
          commentCount:{$count:{}}
        }
      }
    },
    {
      $project: {
        content: 1,
        video: 1,
        commentOwner: 1,
        createdAt: 1,
        commentCount:1
      },
    },
  ]);

  if (!commentAggregate) {
    throw new ApiError(
      "Something went wrong while aggregating comments!!",
      501
    );
  }

  const allComments = await Comment.aggregatePaginate(
    commentAggregate,
    options
  );

  if (!allComments) {
    throw new ApiError("Something went wrong while getting comments!!!", 501);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        allComments.docs,
        "Video Comments Fetched Sucessfully!!"
      )
    );
});

const getPostComments = asyncHandler(async (req, res) => {
  //1) verify authentication
  //2) get page and limit from query
  //3) verify videoId
  //4) check if video exist
  //5) lookup in comment document with video->videoId
  //6) also get the owner-> avatar,fullname and username

  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError("Invalid Post Id", 401);
  }

  const postExists = await Post.findById(postId);

  if (!postExists) {
    throw new ApiError("Post does not exists!!!", 404);
  }

  const commentAggregate = Comment.aggregate([
    {
      $match: {
        post: new mongoose.Types.ObjectId(postId),
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
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
        as: "commentOwner",
      },
    },
    {
      $project: {
        content: 1,
        post: 1,
        commentOwner: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!commentAggregate) {
    throw new ApiError(
      "Something went wrong while aggregating comments!!",
      501
    );
  }

  const allComments = await Comment.aggregatePaginate(
    commentAggregate,
    options
  );

  if (!allComments) {
    throw new ApiError("Something went wrong while getting comments!!!", 501);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        allComments.docs,
        "Post Comments Fetched Sucessfully!!"
      )
    );
});

export {
  addVideoComment,
  addPostComment,
  updateComment,
  deleteComment,
  getVideoComments,
  getPostComments,
};
