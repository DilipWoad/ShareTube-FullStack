import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  //1)verify authentication
  //2)get channelId from url
  //3) check valid ChannelId
  //4) check is Channel exists with the given Id
  //5) give current user a button (in UI) that will subscribe or unsubscribe the channel
  //6) we add or remove user from the subscriber list

  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError("Invalid Channel Id", 401);
  }

  if (subscriberId.toString() === channelId.toString()) {
    throw new ApiError("You can't Subscribe to your own channel!!", 401);
  }

  const isChannelExists = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });

  //if present delete it from the Subscriber list
  if (isChannelExists) {
    await Subscription.findByIdAndDelete(isChannelExists._id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          {},
          "User Unsubscribed from the Channel Sucessfully!!"
        )
      );
  } else {
    await Subscription.create({
      subscriber: subscriberId,
      channel: channelId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(201, {}, "User Subscribed to the Channel Sucessfully!!")
      );
  }
});

const getUsersChannelSubscribers = asyncHandler(async (req, res) => {
  //1)verify authentication
  //2)verify channel Id
  //3)check if channel exists
  //4)match channelId woth subscription ChannelId
  //5)then lookup with subscriber to user and only get ther name,avatar and user naem

  const channelId = req.user._id; //my id
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError("Invalid Channel Id", 401);
  }

  const channelSubscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        let: { subscriberId: "$subscriber" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$subscriberId"],
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
        as: "channelSubscribers",
      },
    },
    {
      $project: {
        channelSubscribers: 1,
      },
    },
  ]);

  if (channelSubscribers.length === 0) {
    throw new ApiError("Channel has no Subscribers", 404);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        channelSubscribers,
        "Users Channel Subscribers Fetched Successfully"
      )
    );
});

const getUsersSubscribedToChannels = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;

  if (!mongoose.isValidObjectId(subscriberId)) {
    throw new ApiError("Invalid Subscriber Id!!", 401);
  }

  const userSubscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        let: { channelId: "$channel" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$channelId"],
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
        as: "userSubscribedChannels",
      },
    },
    {
      $project: {
        userSubscribedChannels: 1,
      },
    },
  ]);

  if (userSubscribedChannels.length === 0) {
    throw new ApiError("User has not Subscribed To Any of the Channels!!", 404);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        userSubscribedChannels,
        "User subscribed Channels fetched Successfully!!"
      )
    );
});

export {
  toggleSubscription,
  getUsersChannelSubscribers,
  getUsersSubscribedToChannels,
};
