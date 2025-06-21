import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessTokens,
  registerUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetail,
  updateUserAvatar,
  updateUserCover,
  getUserProfile,
  getUserWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAuthentication } from "../middlewares/auth.middelware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router
  .route("/login")
  .post(
    loginUser
  );
//secure routes
router
  .route("/logout")
  .post(
    verifyAuthentication, 
    logoutUser
  );

router
  .route("/refresh-token")
  .post(
    // verifyAuthentication, 
    refreshAccessTokens
  );

router
  .route("/change-password")
  .patch(
    verifyAuthentication, 
    changeCurrentPassword
  );

router
  .route("/userinfo")
  .get(
    verifyAuthentication, 
    getCurrentUser
  );

router
  .route("/update-details")
  .patch(
    verifyAuthentication, 
    updateAccountDetail
  );

router
  .route("/update-avatar")
  .patch(
    verifyAuthentication, 
    upload.single("avatar"), 
    updateUserAvatar
  );

router
  .route("/update-coverimage")
  .patch(
    verifyAuthentication, 
    upload.single("coverImage"), 
    updateUserCover
  );

router
  .route('/channel/:username')
  .get(
    verifyAuthentication,
    getUserProfile
  );

router
  .route('/history')
  .get(
    verifyAuthentication,
    getUserWatchHistory
  );

export default router;
