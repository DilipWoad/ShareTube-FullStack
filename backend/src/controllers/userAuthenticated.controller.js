import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const isUserAuthenticated = asyncHandler(async (req, res) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      throw new ApiError("Invalid Authorization", 403);
    }
    //verify it
    const isTokenCorrect = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );

    if (!isTokenCorrect) {
      throw new ApiError("Invalid Token", 403);
    }

    return res.status(200).json({ isAuthenticated: true });
  } catch (error) {
    return res.json({ isAuthenticated: false });
  }
});

export { isUserAuthenticated };
