import { Router } from "express";
import {
    ChangeCoverImage,
    changeAvatar,
    changeUserPassword,
    logginUser,
    logout,
    refreshAccessToken,
    registerUser,
    updateUserInformation,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

let router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);

router.route("/login").post(logginUser);

router.route("/logout").post(varifyJWT, logout);

router.route("/change-password").post(varifyJWT, changeUserPassword);
router.route("/update-profile").post(varifyJWT, updateUserInformation);
router.route("/update-avatar").post(
   upload.single('avatar'),
    varifyJWT,
    changeAvatar
);

router.route("/update-coverImage").post(
    upload.single('coverImage'),
     varifyJWT,
     ChangeCoverImage
 );

router.route("/generate-access-token").post(refreshAccessToken);
export default router;
