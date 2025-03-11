import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylist,
  removeVideoFromPlaylist,
  updatePlaylistDetails,
} from "../controllers/playlist.controller.js";
import { verifyAuthentication } from "../middlewares/auth.middelware.js";

const router = Router();

router.use(verifyAuthentication);

router.route("/").post(createPlaylist);
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);
router.route("/user/:userId").get(getUserPlaylist);
router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylistDetails)
  .delete(deletePlaylist);
export default router;
