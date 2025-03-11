import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth.middelware.js";
import {
  getUsersChannelSubscribers,
  getUsersSubscribedToChannels,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
const router = Router();

router.use(verifyAuthentication);

router.route("/c/:channelId").post(toggleSubscription);
router.route("/subscribers").get(getUsersChannelSubscribers);
router.route("/my-subscription").get(getUsersSubscribedToChannels);

export default router;
