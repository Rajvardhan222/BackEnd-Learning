import { Router } from "express";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controllers.js";

let router = Router()

router.route("/video/:videoId").post(varifyJWT,toggleVideoLike)

router.route("/comment/:commentId").post(varifyJWT,toggleCommentLike)

router.route("/tweet/:tweetId").post(varifyJWT,toggleTweetLike)

router.route("/get-liked-video").get(varifyJWT,getLikedVideos)



export default router