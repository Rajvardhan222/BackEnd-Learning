import mongoose, { Schema } from "mongoose";

const likesSchema = new Schema(
    {
        comment: {
            type: Object.Types.ObjectId,
            ref: "Comments",
        },
        video: {
            type: Object.Types.ObjectId,
            ref: "Video",
        },
        tweet: {
            type: Object.Types.ObjectId,
            ref: "Tweets",
        },
        likedBy: {
            type: Object.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Likes = mongoose.model("Likes", likesSchema);
