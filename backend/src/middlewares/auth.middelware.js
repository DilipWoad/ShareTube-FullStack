import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyAuthentication = asyncHandler(async (req, res, next) => {
  //it will be a middleware
  //If this middleware will be use to check if user is logged in or not

  //this can be check by using access token
  //We can get the token from the req.cookies or header

  //cookies from web and header from mobile

  //mobile -> "Authorization" : "Bearer accessToken"

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //check if token present
    if (!token) {
      throw new ApiError("Invalid Authorization !!");
    }

    //if token present check if it's valid token or not with jwt

    const jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    
    // console.log("AccessToken from cookie/header:", token);
    if (!jwtPayload) {
      throw new ApiError("Invalid Access Token");
    }

    //if jwtPayload present meaning we get the original payload given at the creation of the access token
    //i.e -> {_id,username,email...}

    //now we have id we can get the user

    const user = await User.findById(jwtPayload?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError("Invalid Access Token!!");
    }

    //if found add this user info(all the info) in the "req" object

    req.user = user;
    
    //once added to the req obj now work of the middelware is over call the next function
    next();
  } catch (error) {
    console.log("At verifying JWT");
    next(error);
  }
});

export { verifyAuthentication };
