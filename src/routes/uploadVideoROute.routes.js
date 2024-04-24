import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, togglePublishStatus, updateVideoData, uploadVideo } from "../controllers/video.controllers.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

let router = Router();

router.route("/upload").post(
    varifyJWT,
    upload.fields([
        {
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    uploadVideo
);

router.route('/update/:videoId').post(varifyJWT,updateVideoData)
router.route('/delete/:videoId').post(varifyJWT,deleteVideo)
router.route('/tooglePublish/:videoId').post(varifyJWT,togglePublishStatus)
router.route('/getAllVideos').get(varifyJWT,getAllVideos)
router.route('/getVideoById/:videoId').get(varifyJWT,getVideoById)

export default router;
