import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";
import mongoose from "mongoose";

//all the user related fuction will be written here
const generateAcessAndRefreshTokens = async (userId) => {
  try {
    //first find user document
    const user = await User.findById(userId);
    //now we have the user document i.e -> {id,email,username,fullName etc...}

    //create access and refresh token using function created for each schema
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    //once created both add the refresh token to the database
    user.refreshToken = refreshToken;
    //now save the database
    //while saving the database will validate the schema Again
    //so dont validate
    user.save({ validateBeforeSave: false });
    //now return both Access and Refresh Token

    return { accessToken, refreshToken };
    //try to wrap around in try-catch
  } catch (error) {
    throw new ApiError("Something went wrong while generating tokens", 500);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get the info from the form comming from the body
  // console.log(req.body);
  const { username, email, password, fullName } = req.body;

  if (
    [username, email, password, fullName].some((feild) => {
      return feild === "";
    })
  ) {
    throw new ApiError("Feilds can't be empty", 400);
  }

  // //validate user details
  // if (username === "" || email === "" || password === "" || fullName === "") {
  //   return res.status(400).json({
  //     message: "Feilds cannot be emepty",
  //   });
  // }

  //check is user already in the DataBase
  const existedUser = await User.findOne({
    $or: [{ username, email }],
  });
  if (existedUser) {
    //remove the file from the server

    // fs.unlinkSync(req.files?.avatar[0]?.path);
    // if (req.files?.coverImage) {
    //   fs.unlinkSync(req.files?.coverImage[0]?.path);
    // }
    throw new ApiError("User Already Exist", 409);
  }

  //Check is file is reached the Server
  const localAvatarFilePath = req.files?.avatar[0]?.path;
  const localCoverImageFilePath = req.files?.coverImage
    ? req.files?.coverImage[0]?.path
    : null;
  if (!localAvatarFilePath) {
    throw new ApiError("Avatar Img is required!!");
  }

  //Now we have Files in the Server Upload it to Cloudinary
  const avatar = await uploadToCloudinary(localAvatarFilePath);
  // console.log(req.files.coverImage);
  const coverImage = await uploadToCloudinary(localCoverImageFilePath);

  if (!avatar) {
    throw new ApiError(
      "Something Went Wrong While Uploading the Avatar Image!!",
      401
    );
  }

  //Now Create A User
  const user = await User.create({
    username,
    email,
    fullName,
    password,
    avatar: avatar?.url,
    coverImage: coverImage ? coverImage?.url : "",
  });

  if (!user) {
    console.log("Deleting the Images...");
    deleteFromCloudinary([avatar?.public_id, coverImage?.public_id]);
  }
  //password is bcrypt in the userModel and added their
  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //now we can send a response to user but we will remove password and refreshToken from it

  if (!userCreated) {
    throw new ApiError("Something went wrong will creating the user!!", 500);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, userCreated, "User Created Successfully!!!"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get login credentials from the user
  const { email, password } = req.body;

  //validate email and password
  if (email.trim() === "" || password.trim() === "") {
    throw new ApiError("Email and Password are required", 400);
  }

  //if not empty,now check if user exist or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError("User Not Found or Incorrect email ID", 401);
  }

  //if exist check the password is correct or not
  const isPasswordCorrect = await user.isCorrectPassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError("Incorrect Password,Please Try Again!!", 401);
  }

  // If both Email and Password correct generate a refresh and access token
  // add refresh token to MongoDB and send Access token to user
  const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //add this token to the cookie
  //and it through response

  const AccessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: process.env.CROSS_ORIGIN==='http://localhost:5173' ? "Strict" : "None",
    // sameSite: "Strict",
    maxAge:24*60*60*1000
  };
  const RefreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: process.env.CROSS_ORIGIN==='http://localhost:5173' ? "Strict" : "None",
    // sameSite: "Strict",
    maxAge:7*24*60*60*1000
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, AccessTokenOptions)
    .cookie("refreshToken", refreshToken, RefreshTokenOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //for logout
  //clear the cookies make sure user is present in the body
  //also remove the refreshToken from the user schema /in database
  // make sure a valid access token can handle this logout

  //usig req.user we have user details

  const user = req.user;
  if (!user) {
    throw new ApiError("Invalid Api Call make sure you are Logged in", 401);
  }

  //if loggedin
  //clear the cookies
  //find the user in database and remove the refreshtoken
  const userRefresh = await User.findByIdAndUpdate(
    user._id,
    {
      $unset: {
        refreshToken: "",
      },
    },
    { new: true }
  );
  if (!userRefresh) {
    throw new ApiError("Somthing went wrong while updating refreshtoken", 401);
  }
  // userRefresh.save({validateBeforeSave:false});
  //now clear the cokies

  const AccessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: process.env.CROSS_ORIGIN==='http://localhost:5173' ? "Strict" : "None",
    // sameSite: "Strict",
    maxAge:24*60*60*1000
  };
  const RefreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: process.env.CROSS_ORIGIN==='http://localhost:5173' ? "Strict" : "None",
    // sameSite: "Strict",
    maxAge:7*24*60*60*1000
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, AccessTokenOptions)
    .cookie("refreshToken", refreshToken, RefreshTokenOptions)
    .json(new ApiResponse(201, [], "User Logged Out Successfully!!"));
});

// const refreshAccessTokens = asyncHandler(async (req, res) => {
//   //get the refresh token from the cookies
//   //for mobile it will come from body
//   //get user data from database
//   //compare the refreshtoken from database and from cookies
//   //now generate AccessToken and refresh token
//   //add both in cookies and also update the refreshtoken in the database

//   const receivedRefreshToken =
//     req.cookies?.refreshToken || req.body?.refreshToken;

//   if (!receivedRefreshToken) {
//     throw new ApiError("Invalid Request", 401);
//   }

//   const user = req.user;
//   const userInDatabase = await User.findById(user._id);
//   if (!userInDatabase) {
//     throw new ApiError("User not found!!", 404);
//   }

//   if (receivedRefreshToken !== userInDatabase?.refreshToken) {
//     throw new ApiError(
//       "Users refreshToken does not matches with Database RefreshToken!!",
//       401
//     );
//   }

//   const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(
//     user._id
//   );

//   await User.findByIdAndUpdate(user._id, {
//     $set: {
//       refreshToken,
//     },
//   });

//   const AccessTokenOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV,
//     sameSite: process.env.CROSS_ORIGIN==='http://localhost:5173' ? "Strict" : "None",
//     // sameSite: "Strict",
//     maxAge:15*60*1000
//   };
//   const RefreshTokenOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV,
//     sameSite: process.env.CROSS_ORIGIN==='http://localhost:5173' ? "Strict" : "None",
//     // sameSite: "Strict",
//     maxAge:7*24*60*60*1000
//   };
//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, AccessTokenOptions)
//     .cookie("refreshToken", refreshToken, RefreshTokenOptions)
//     .json(
//       new ApiResponse(
//         201,
//         {
//           // user: loggedInUser,
//           accessToken,
//           refreshToken,
//         },
//         "Acess Token Refreshed Successfully!!"
//       )
//     );
// });
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { generateAcessAndRefreshTokens } from "../utils/jwt.utils.js"; // assuming you have this
// import { CROSS_ORIGIN } from "../config/constants.js"; // assuming you defined this

const refreshAccessTokens = asyncHandler(async (req, res) => {
  const receivedRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!receivedRefreshToken) {
    throw new ApiError("Invalid Request: No refresh token found", 401);
  }

  // 1. Verify refresh token
  let payload;
  try {
    payload = jwt.verify(receivedRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
  } catch (error) {
    throw new ApiError("Refresh Token is invalid or expired", 403);
  }

  // 2. Find user by id from decoded payload
  const userInDatabase = await User.findById(payload._id);
  if (!userInDatabase) {
    throw new ApiError("User not found", 404);
  }

  // 3. Optional: compare refresh tokens (can skip if not storing in DB)
  if (userInDatabase.refreshToken !== receivedRefreshToken) {
    throw new ApiError("Refresh Token does not match DB", 403);
  }

  // 4. Generate new tokens
  const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(userInDatabase._id);
console.log(accessToken,refreshToken)
  // 5. Update refresh token in DB
  userInDatabase.refreshToken = refreshToken;
  await userInDatabase.save({ validateBeforeSave: false });

  // 6. Cookie options
  const isProduction = process.env.NODE_ENV === "production";

  const AccessTokenOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: process.env.CROSS_ORIGIN === "http://localhost:5173" ? "Strict" : "None",
    maxAge: 24*60*60*1000 // 15 min
  };

  const RefreshTokenOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: process.env.CROSS_ORIGIN === "http://localhost:5173" ? "Strict" : "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, AccessTokenOptions)
    .cookie("refreshToken", refreshToken, RefreshTokenOptions)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "Access Token refreshed successfully"
      )
    );
});



//editing
const changeCurrentPassword = asyncHandler(async (req, res) => {
  //User Authentication and Authorization will be done by the middleware
  //You will receive password from User
  const { oldPassword, newPassword } = req.body;
  //oldPassword to check if user is known it previous password,if other are trying to chnage password or not

  if (oldPassword.trim() === "" || newPassword.trim() === "") {
    throw new ApiError("Password Cannot be Empty!!", 401);
  }

  //find user info from database
  const user = await User.findById(req.user?._id);
  const isCorrectPassword = await user.isCorrectPassword(oldPassword);

  if (!isCorrectPassword) {
    throw new ApiError("Invalid Password.Please Enter Correct Password");
  }

  //now save the new password
  // User.findByIdAndUpdate(req.user?.id,{
  //   password:newPassword
  // })

  //as we are login and has user info in body we can update the password here
  //this will trigger the .pre function and check ispassword modified
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  //middleware will handle Authentication
  const user = req.user;

  return res
    .status(200)
    .json(
      new ApiResponse(201, user, "User information Fetched Successfully!!")
    );
});

const updateAccountDetail = asyncHandler(async (req, res) => {
  //middleware will handle authentication ->AccessToken
  const { fullName, email } = req.body;

  if (fullName.trim() === "" || email.trim() === "") {
    throw new ApiError("FullName and email can't be Empty!!");
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullName,
          email,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(
        "Something went wrong while updating user detail",
        401
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(201, user, "User detail updated Successfully!!"));
  } catch (error) {
    throw new ApiError("Something went wrong while updating user detail", 401);
  }
});

// const updateUserAvatarAndCoverImage = asyncHandler(async(req,res)=>{
//   //middleware will handle the authentication
//   //get avatar from user
//   const localAvatarFilePath = req.files.avatar[0]?.path;
//   const localCoverImageFilePath = req.files.coverImage ? req.files.coverImage[0]?.path : null;
//   if(!localAvatarFilePath){
//     throw new ApiError("Avatr Filed is Empty!!",401)
//   }
//   //before changing the avatar delete the current avatar from the cloudinary
//   const user = req.user;

//   const isDeletedFromCloudinary =await deleteFromCloudinary([user.avatar,user.coverImage]);

//   if(!isDeletedFromCloudinary){
//     //also remove the file from the server also
//     fs.unlinkSync(localAvatarFilePath);
//     if(localCoverImageFilePath !== null){
//       fs.unlinkSync(localCoverImageFilePath)
//     }
//     throw new ApiError("Something went wrong while deleting images from the Cloudinary",402);
//   }
//   //now it is Deleted from Cloudinary
//   //now we have image on the server
//   //upload it to cloudinary
//   const avatar = await uploadToCloudinary(localAvatarFilePath);
//   const coverImage = await uploadToCloudinary(localCoverImageFilePath);

//   if (!avatar) {
//     throw new ApiError(
//       "Something Went Wrong While Uploading the Avatar Image!!",401
//     );
//   }

//   //User update
//   const userAvatarCover = await User.findByIdAndUpdate(req.user?._id,
//     {
//       $set:{
//         avatar:avatar?.url,
//         coverImage : coverImage ? coverImage?.url :""
//       }
//     },
//     {new:true}
//   ).select("-passwod -refreshToken")

//   return res.status(201).json(
//     new ApiResponse(
//       201,userAvatarCover,"User file Updated Successfully!!"
//     )
//   )
// })

const updateUserAvatar = asyncHandler(async (req, res) => {
  //middleware will handle the authentication
  //get avatar from user
  const localAvatarFilePath = req.file?.path;
  if (!localAvatarFilePath) {
    throw new ApiError("Avatar Field is Empty!!", 401);
  }
  //before changing the avatar delete the current avatar from the cloudinary
  const user = req.user;

  // const isDeletedFromCloudinary = await deleteFromCloudinary(user.avatar);
  // console.log(isDeletedFromCloudinary);

  // if (!isDeletedFromCloudinary) {
  //   //also remove the file from the server also
  //   fs.unlinkSync(localAvatarFilePath);
  //   throw new ApiError(
  //     "Something went wrong while deleting images from the Cloudinary",
  //     402
  //   );
  // }
  //now it is Deleted from Cloudinary
  //now we have image on the server
  //upload it to cloudinary
  const avatar = await uploadToCloudinary(localAvatarFilePath);

  if (!avatar.url) {
    // fs.unlinkSync(localAvatarFilePath);
    throw new ApiError(
      "Something Went Wrong While Uploading the Avatar Image!!",
      401
    );
  }

  const isDeletedFromCloudinary = await deleteFromCloudinary(user.avatar);
  console.log(isDeletedFromCloudinary);

  if (!isDeletedFromCloudinary) {
    //also remove the file from the server also
    // fs.unlinkSync(localAvatarFilePath);
    throw new ApiError(
      "Something went wrong while deleting images from the Cloudinary",
      402
    );
  }

  //User update
  const userAvatar = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar?.url,
      },
    },
    { new: true }
  ).select("-passwod -refreshToken");

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        userAvatar.avatar,
        "User Avatar Image Updated Successfully!!"
      )
    );
});

const updateUserCover = asyncHandler(async (req, res) => {
  //middleware will handle the authentication
  //get avatar from user
  const localCoverFilePath = req.file?.path;
  if (!localCoverFilePath) {
    throw new ApiError("Cover image Field is Empty!!", 401);
  }
  //before changing the avatar delete the current avatar from the cloudinary
  const user = req.user;

  

  //now it is Deleted from Cloudinary
  //now we have image on the server
  //upload it to cloudinary
  const coverImage = await uploadToCloudinary(localCoverFilePath);

  if (!coverImage.url) {
    throw new ApiError(
      "Something Went Wrong While Uploading the Cover Image!!",
      401
    );
  }

  if (user.coverImage !== "") {
    const isDeletedFromCloudinary = await deleteFromCloudinary(user.coverImage);
    if (!isDeletedFromCloudinary) {
      //also remove the file from the server also
      // fs.unlinkSync(localCoverFilePath);
      throw new ApiError(
        "Something went wrong while deleting images from the Cloudinary",
        402
      );
    }
  }

  //User update
  const userCover = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage?.url,
      },
    },
    { new: true }
  ).select("-passwod -refreshToken");

  return res
    .status(201)
    .json(
      new ApiResponse(201, userCover.coverImage, "User Cover Image Updated Successfully!!")
    );
});

const getUserProfile = asyncHandler(async (req, res) => {
  //we will get user info from url ->username
  const username = req.params["username"];
  //check in db is username exist
  if (!username.toLowerCase()?.trim()) {
    throw new ApiError("Channel Username is Missing!!", 401);
  }
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const isUsernameExists = await User.find({ username: username });
  //not exist then 404
  if (!isUsernameExists) {
    throw new ApiError("Channel of the giving username does not exist!!", 404);
  }
  //if exist then now do the pipeline
  const channel = await User.aggregate([
    //first do the match -> match in database
    {
      $match: {
        username: username,
      },
      //check is it match/found in db
      //now we get a Document which have this USERNAME
    },
    //then next pipeline is to find Channel Subscriber
    {
      // lookup->from:subscriber model,local/primarykey is _id,to/foreign_key->channel(i.e is present in subscriber model)
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    //now for the channel the it has subscribed to same as above just replace foreign key
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    //now left join it model Subscribers to USER model
    //add new feilds to the User model -> also calculatte the COUNT of Subscriber and Subscribedto here
    {
      //Also add the Is current User Subscrubed to the current Channel Profile , True or False to toggle Subscriber button,
      //to do it check is current logged in user's userID present in the PROFILE (Subcriber) documents
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
        isCurrentUserSubscribed: {
          $in:[
            userId,
            {
              $map:{
                input:"$subscribers",
                as:"sub",
                in:"$$sub.subscriber"
              }
            }
          ]
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscriberCount: 1,
        subscribedToCount: 1,
        isCurrentUserSubscribed: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);

  console.log(channel);
  if (!channel?.length) {
    throw new ApiError(
      "Something went wrong while fetching the Channel Profile!!",
      404
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, channel[0], "Channel Profile fetched Successfully!!")
    );
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      //1)Get the Current User's Document
      //2)Make sure create a new ObjectID using mongoose so it can find in mongodb
      //as in pipeline the id's are directly given to monogdo ,it does not goes through mongoose
      //as mongoose automatic converts _id to String and then to ObjectId to talk with mongoDB
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        let: { videoIds: "$watchHistory" },
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
            $unwind: {
              path: "$videoOwner",
            },
          },
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              views: 1,
              title: 1,
              videoOwner: 1,
            },
          },
        ],
        as: "watchHistory",
      },
    },
    {
      $project: {
        _id: 0,
        watchHistory: 1,
      },
    },
    
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(201, user[0], "User WatchHistory Fetched Successfully!!")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessTokens,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetail,
  updateUserAvatar,
  updateUserCover,
  getUserProfile,
  getUserWatchHistory,
};
