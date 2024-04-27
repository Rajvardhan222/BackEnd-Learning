import { Router } from "express";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comments.controllers.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

let router = Router();

// Comments routes


router.route("/get-video-comments/:videoId").get(getVideoComments);

router.route("/add/:videoId").post(varifyJWT, addComment);

router.route("/update/:commentId").post(varifyJWT, updateComment);

router.route("/delete/:commentId").post(varifyJWT, deleteComment);

export default router;
