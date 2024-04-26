import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, togglePublishStatus, updateVideoData, uploadVideo } from "../controllers/video.controllers.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscriber.controllers.js";

let router = Router();
router.route("/toogle/:channelId").patch(varifyJWT,toggleSubscription)
router.route("/subscribers/:channelId").patch(varifyJWT,getUserChannelSubscribers)
router.route("/subscribedTo/:subscriberId").patch(varifyJWT,getSubscribedChannels)
export default router;