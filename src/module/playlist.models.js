import mongoose, { Schema } from "mongoose";

let playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videos: [
            {
                type: Object.Types.ObjectId,
                ref: "Video",
            },
        ],
        owner: {
            type: Object.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
