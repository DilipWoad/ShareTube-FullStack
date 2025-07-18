import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

const createPost = asyncHandler(async (req, res) => {
  //1) verify authentication
  //2) get content from the body
  //3) check any empty values
  //4) create a Post and add the conent and the createBy userId

  const { content } = req.body;

  if (content?.trim() === "") {
    throw new ApiError("Post content cannot be Empty!! Add some content", 401);
  }

  const post = await Post.create({
    content,
    owner: req.user._id,
  });

  if (!post) {
    throw new ApiError("Something went wrong while creating the post", 501);
  }

  return res
    .status(200)
    .json(new ApiResponse(201, post, "Post created Successfully"));
});

const getUserPosts = asyncHandler(async (req, res) => {
  //1) verify Authentication
  //2) get useId from param
  //3 verify valid ObjectId
  //4) check in the database if present or not
  //5) get the Post also get the user avatar and full Name and username

  const { userId } = req.params;
  const currentUserId = req.user._id;

  const isValid = mongoose.isValidObjectId(userId);
  if (!isValid) {
    throw new ApiError("Invalid user Id", 401);
  }

  const posts = await Post.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
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
              avatar: 1,
              username: 1,
            },
          },
        ],
        as: "postOwner",
      },
    },
    { $unwind: { path: "$postOwner", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
      },
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
        postOwner: 1,
        likeCount: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  // console.log(posts)
  console.log("posts -> : ", posts);
  if (posts.length === 0) {
    throw new ApiError("User has no Posts!!", 404);
  }

  const postIdDoc = posts.map((p) => p._id);
  console.log("postIdDoc : ", postIdDoc);

  const likeDoc = await Like.find({
    post: { $in: postIdDoc },
    likeBy: currentUserId,
  }).select("post");
  console.log("likeDoc : ", likeDoc);

  const postLikesIds = new Set(likeDoc.map((doc) => doc.post.toString()));
  console.log("postLikesIds : ", postLikesIds);

  const userPostsLikedStatus = posts.map((post) => ({
    ...post,
    isLikedByCurrentUser: postLikesIds.has(post._id.toString()),
  }));
  console.log("userPostsLikedStatus : ", userPostsLikedStatus);

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        userPostsLikedStatus,
        "Users Post fetched Successfully"
      )
    );
});

const updatePost = asyncHandler(async (req, res) => {
  //1) verify Authentication
  //2) validate postId
  //3) check in database if exists
  //4) check is content is empty
  //4) update it

  const { postId } = req.params;
  const { content } = req.body;
  //TODO :Make a Function for checking validObject
  const isValid = mongoose.isValidObjectId(postId);
  if (!isValid) {
    throw new ApiError("Invalid Post Id", 401);
  }

  const postExists = await Post.findById(postId);
  if (!postExists) {
    throw new ApiError("Post does not exist", 404);
  }

  if (content?.trim() === "") {
    throw new ApiError("Post Content cannot be Empty!", 401);
  }
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updatedPost) {
    throw new ApiError("Something went wrong while updating the Post!!", 501);
  }

  return res
    .status(200)
    .json(new ApiResponse(201, updatedPost, "Post Updated Successfully!!"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const isValid = mongoose.isValidObjectId(postId);
  if (!isValid) {
    throw new ApiError("Invalid Post Id", 401);
  }

  const postExists = await Post.findById(postId);
  if (!postExists) {
    throw new ApiError("Post does not exist", 404);
  }

  const deletePost = await Post.findByIdAndDelete(postId);

  if (!deletePost) {
    throw new ApiError("Something went wrong while deleting the post!!", 501);
  }

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Post Deleted Successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  //1)verify auth
  //2)verify postId
  //3)check if post exists
  //4)Find in Comment
  //5)Find all the documents in comment that has post._id = postId
  //6)it will have all the documents that has post._id as postId
  //7)if null that means no comments
  //8)we get arrays of comments with its owner id(try aggregate so that we can get userInfomation as well as post._id)
  //9) if doing aggregate do count of document,get comment owner info,post owner info

  const { postId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError("Invalid PostId!!", 403);
  }

  const postExist = await Post.findById(postId);

  if (!postExist) {
    throw new ApiError("Post does not Exists!", 404);
  }

  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
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
              avatar: 1,
              username: 1,
            },
          },
        ],
        as: "postOwner",
      },
    },
    { $unwind: { path: "$postOwner", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
      },
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
        postOwner: 1,
        likeCount: 1,
      },
    },
  ]);

  console.log("post :", post);

  const postIds = post.map((p) => p._id);
  console.log("postIds :", postIds);

  const likeDoc = await Like.findOne({
    post: { $in: postIds },
    likeBy: userId,
  }).select("post");

  console.log("likeDoc : ", likeDoc);
  //likeDoc will be either null or an Obj{}

  const aPost = post[0];
  const postWithLikeStatus = {
    ...aPost,
    isLikedByCurrentUser: likeDoc !== null ? true : false,
  };

  console.log("postWithLikeStatus : ", postWithLikeStatus);

  return res
    .status(200)
    .json(
      new ApiResponse(200, postWithLikeStatus, "Post fetched successfully")
    );
});
export { createPost, getUserPosts, updatePost, deletePost, getPostById };
