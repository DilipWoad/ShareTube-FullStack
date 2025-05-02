

import { Router } from "express";
import { createPost, deletePost, getPostById, getUserPosts, updatePost } from "../controllers/post.controller.js";
import { verifyAuthentication } from "../middlewares/auth.middelware.js";

const router = Router();

router.use(verifyAuthentication);

router.route('/').post(createPost);
router.route('/user/:userId').get(getUserPosts);
router.route('/:postId').patch(updatePost).delete(deletePost).get(getPostById)


export default router;