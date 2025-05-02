import { Router } from "express";
import {verifyAuthentication} from "../middlewares/auth.middelware.js"
import { getLikedVideos, isLikedAlready, isUserAlreadyLikeThePost, toggleCommentLike, togglePostLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.use(verifyAuthentication)

router.route('/v/:videoId').post(toggleVideoLike).get(isLikedAlready)
router.route('/c/:commentId').post(toggleCommentLike);
router.route('/p/:postId').post(togglePostLike).get(isUserAlreadyLikeThePost);
router.route('/videos').get(getLikedVideos);
export default router;