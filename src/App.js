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

app.use("/api/v1/users", userRoute);
app.use("/api/v1/video", VideoUploaderRoute);

export default app;
