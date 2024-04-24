import mongoose, { Schema } from "mongoose";

const CommentsSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        video: {
            type: Object.Types.ObjectId,
            ref: "Video",
        },
        owner: {
            type: Object.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

export const Comments = mongoose.model("Comments", CommentsSchema);
