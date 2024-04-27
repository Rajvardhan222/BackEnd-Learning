import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
const tweetsSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
tweetsSchema.plugin(aggregatePaginate)
export const Tweets = mongoose.model("Tweets", tweetsSchema);
