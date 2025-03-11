import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth.middelware.js";
import {
  addPostComment,
  addVideoComment,
  deleteComment,
  getPostComments,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyAuthentication);
router.route("/:videoId").post(addVideoComment).get(getVideoComments);
router.route("/post/:postId").post(addPostComment).get(getPostComments);
router.route("/c/:commentId").patch(updateComment).delete(deleteComment);

export default router;
