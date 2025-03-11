import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyAuthentication } from "../middlewares/auth.middelware.js";

const router = Router();
router.use(verifyAuthentication);
router.route('/').get(getChannelStats);
router.route('/videos').get(getChannelVideos);

export default router;