import { Router } from "express";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweets.controllers.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

let router = Router()

router.route('/create').post(varifyJWT,createTweet)

router.route('/get-user-tweets/:userId/:limit/:pages').get(varifyJWT,getUserTweets)

router.route("/update/:tweetId").post(varifyJWT,updateTweet)

router.route('/delete/:tweetId').post(varifyJWT,deleteTweet)

export default router