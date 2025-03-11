import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import { deleteVideo, getAllVideos, getVideoById, publishedVideo, togglePublishStatus, updateVideoDetails } from "../controllers/video.controller.js";
import { verifyAuthentication } from "../middlewares/auth.middelware.js";

const router = Router();

router.use(verifyAuthentication);

router.route('/upload').post(upload.fields([
    {
        name:'videoFile',
        maxCount:1,
    },
    {
        name:"thumbnail",
        maxCount:1,
    },
]),publishedVideo)

router.route('/v/:videoId').get(getVideoById);
router.route('/update/:videoId').patch(upload.single('thumbnail'),updateVideoDetails);
router.route('/delete/:videoId').delete(deleteVideo);
router.route('/togglePublished/:videoId').patch(togglePublishStatus);
router.route('/').get(getAllVideos);


export default router;