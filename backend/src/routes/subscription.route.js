import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth.middelware.js";
import {
  getUsersChannelSubscribers,
  getUsersSubscribedToChannels,
  isUserSubscibed,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
const router = Router();

router.use(verifyAuthentication);

router.route("/c/:channelId").post(toggleSubscription);
router.route("/subscribers").get(getUsersChannelSubscribers);
router.route("/my-subscription").get(getUsersSubscribedToChannels);
router.route("/:videoId").get(isUserSubscibed);

export default router;
