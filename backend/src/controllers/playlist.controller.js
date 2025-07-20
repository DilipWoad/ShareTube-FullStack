import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //1)verify authentication
  //2)get Title and Description from the body
  //3)check if any of it is empty
  //4)Create a document add the title,description and owner of the playlist

  const { title, description } = req.body;

  if (title?.trim() === "") {
    throw new ApiError("Title cannot be Empty!!", 401);
  }
  if (description?.trim() === "") {
    throw new ApiError("Description cannot be Empty!!", 401);
  }

  const playlist = await Playlist.create({
    title,
    description,
    owner: req.user?._id,
  });

  if (!playlist) {
    throw new ApiError("Something went wrong while Creating a playlist", 501);
  }

  return res
    .status(200)
    .json(new ApiResponse(201, playlist, "Playlist created Successfully!!"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  //1)verify authentication
  //2)get playlist Id and video Id
  //3)verify playlist id and video Id
  //4)check is playlist exists
  //5)check if video exists
  //6)now if playlist and video exists then check if video present in the playlist already
  //7)if not present insert videoId in the videos[]array

  const { videoId, playlistId } = req.params;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError("Invalid video Id", 401);
  }

  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError("Invalid Playlist Id", 401);
  }

  //check is they exists already
  const isPlaylistExists = await Playlist.findById(playlistId);
  if (!isPlaylistExists) {
    throw new ApiError(
      "Playlist does not Exists!! Create a Playlist to add the video!!",
      404
    );
  }
  const isVideoExists = await Video.findById(videoId);
  if (!isVideoExists) {
    throw new ApiError("Given Video does not Exist!!", 404);
  }

  //check if video Exist in the given playlist

  //   const isVideoExistInPlaylist = await Playlist.aggregate([
  //     {
  //       $match: {
  //         _id: new mongoose.Types.ObjectId(playlistId),
  //       },
  //     },
  //     {
  //       $set: {
  //         videos: {
  //           $cond: {
  //             if: { $in: [new mongoose.Types.ObjectId(videoId), "$videos"] },
  //             then: "$videos",
  //             else: {
  //               $concatArrays: [
  //                 "$videos",
  //                 [new mongoose.Types.ObjectId(videoId)],
  //               ],
  //             },
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $merge: {
  //         into: "playlists",
  //       },
  //     },
  //   ]);

  const addVideo = await Playlist.updateOne(
    { _id: playlistId },
    { $addToSet: { videos: new mongoose.Types.ObjectId(videoId) } }
  );

  if (!addVideo) {
    throw new ApiError(
      "Something went wrong while adding video to the playlist",
      501
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Video Added to the playlist successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  //valid
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError("Invalid video Id", 401);
  }
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError("Invalid Playlist Id", 401);
  }

  //check if present in the database
  const isPlaylistExists = await Playlist.findById(playlistId);
  if (!isPlaylistExists) {
    throw new ApiError("Playlist does not Exists", 404);
  }

  const isVideoExists = await Video.findById(videoId);
  if (!isVideoExists) {
    throw new ApiError("This Video does not Exists", 404);
  }

  //ispresent in the playlist and updation using Aggregate

  // const isVideoExistInPlaylist = await Playlist.aggregate(
  //     [
  //         {
  //             $match:{
  //                 _id:new mongoose.Types.ObjectId(playlistId)
  //             }
  //         },
  //         {
  //             $set:{
  //                 videos:{
  //                     $filter:{
  //                         input : "$videos",
  //                         as:"video",
  //                         $cond:{$ne : ["$$video",new mongoose.Types.ObjectId(videoId)]}
  //                     }
  //                 }
  //             }
  //         },
  //         {
  //             $merge:{into:"playlist"}
  //         }
  //     ]
  // )

  const removeVideo = await Playlist.updateOne(
    { _id: playlistId },
    { $pull: { videos: new mongoose.Types.ObjectId(videoId) } } //pull(remove) from videos ->this id(videoId)
  );

  if (!removeVideo) {
    throw new ApiError(
      "Something went wrong while removing the video from playlist",
      501
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, {}, "Video Removed from the Playlist Successfully!!")
    );
});

const getUserPlaylist = asyncHandler(async (req, res) => {
  //1)verify authentication
  //2)from 1st we get userId(current logged In)
  //3)search in PlayList model for owner=userId

  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError("Invalid User Id", 401);
  }
  const isUserExists = await User.findById(userId);
  if (!isUserExists) {
    throw new ApiError("User Does not Exists!", 404);
  }
  //   const userPlaylist = await Playlist.find({
  //     owner: userId,
  //   });
  const userPlaylist = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        let: { videoIds: "$videos" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$videoIds"],
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
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
              as: "videoOwner",
            },
          },
          {
            $addFields: {
              owner: { $first: "$videoOwner" },
            },
          },
          {
            $project: {
              owner: 1,
              videoFile: 1,
              thumbnail: 1,
              views: 1,
              duration: 1,
              title: 1,
              createdAt: 1,
            },
          },
        ],
        as: "playlistVideos",
      },
    },
    {
      $addFields: {
        playlistVideos: { $reverseArray: "$playlistVideos" },
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        owner: 1,
        playlistVideos: 1,
        updatedAt: 1,
        createdAt: 1,
      },
    },
    {
      $sort: { updatedAt: -1 },
    },
  ]);

  if (userPlaylist.length === 0) {
    throw new ApiError("User has no Playlist!!", 404);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, userPlaylist, "User's Playlist fetched Successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError("Invalid Playlist Id", 401);
  }
  //   const isPlaylistExists = await Playlist.findById(playlistId);
  const isPlaylistExists = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        let: { videoIds: "$videos" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$videoIds"],
              },
            },
          },
          {
            //lookup for User Details
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
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
              as: "ownerDetails",
            },
          },
          {
            $addFields: {
              videoOwner: { $first: "$ownerDetails" },
            },
          },
          {
            $project: {
              videoOwner: 1,
              videoFile: 1,
              thumbnail: 1,
              views: 1,
              duration: 1,
              title: 1,
              createdAt: 1,
            },
          },
        ],
        as: "playlistVideos",
      },
    },
    {
      $addFields: {
        playlistVideos: { $reverseArray: "$playlistVideos" },
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        videoOwner: 1,
        //TODO:"Also get Owner Details"
        playlistVideos: 1,
      },
    },
  ]);

  if (!isPlaylistExists) {
    throw new ApiError("Playlist Does not Exists", 404);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, isPlaylistExists[0], "Playlist fetched Successfully")
    );
});

const updatePlaylistDetails = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { title, description } = req.body;

  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError("Invalid Playlist Id", 401);
  }
  const isPlaylistExists = await Playlist.findById(playlistId);

  if (!isPlaylistExists) {
    throw new ApiError("Playlist Does not Exists", 404);
  }

  if (title?.trim() === "") {
    throw new ApiError("Title cannot be Empty!!", 401);
  }
  if (description?.trim() === "") {
    throw new ApiError("Description cannot be Empty!!", 401);
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        title,
        description,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(
      "Something went wrong while updating the playlist details",
      501
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        updatedPlaylist,
        "Playlist Details Updated Successfully!!"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError("Invalid Playlist Id", 401);
  }
  const isPlaylistExists = await Playlist.findById(playlistId);

  if (!isPlaylistExists) {
    throw new ApiError("Playlist Does not Exists", 404);
  }

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!deletedPlaylist) {
    throw new ApiError("Something went wrong while Deleting the playlist", 501);
  }

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Playlist Details Updated Successfully!!"));
});

export {
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getUserPlaylist,
  getPlaylistById,
  updatePlaylistDetails,
  deletePlaylist,
};
