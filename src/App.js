import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);

app.use(bodyParser.json());
app.use(
    express.json({
        limit: "20kb",
    })
);

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(express.static("public"));

app.use(cookieParser());

import userRoute from "./routes/user.routes.js";
import VideoUploaderRoute from "./routes/uploadVideoROute.routes.js";
import SubscriptionRoutes from "./routes/subscription.routes.js";
import playListRoute from "./routes/playlistRoute.routes.js";
import CommentRoute from "./routes/Comments.routes.js";

app.use("/api/v1/users", userRoute);
app.use("/api/v1/video", VideoUploaderRoute);
app.use("/api/v1/subscription", SubscriptionRoutes);
app.use("/api/v1/playlist", playListRoute);
app.use("/api/v1/comments", CommentRoute);

export default app;
