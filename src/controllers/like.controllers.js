import mongoose, {isValidObjectId} from "mongoose"
import {Likes} from "../module/likes.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

  let hasLiked =await  Likes.aggregate(
        [
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $match : {
                    likedBy : req.user?._id
                }
            }
        ]
    )

    if (hasLiked.length > 0) {
        await Likes.findByIdAndDelete(hasLiked[0]._id)
        res.status(200).json(
            new ApiResponse(200,hasLiked[0],"unliked")
        )
    } else {
        await Likes.create({
            video: new mongoose.Types.ObjectId(videoId),
            likedBy: req.user?._id
        })
        res.status(200).json(
            new ApiResponse(200,hasLiked[0],"liked")
        )
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    let hasLiked =await  Likes.aggregate(
        [
            {
                $match: {
                    comment: new mongoose.Types.ObjectId(commentId)
                }
            },
            {
                $match : {
                    likedBy : req.user?._id
                }
            }
        ]
    )

    if (hasLiked.length > 0) {
        await Likes.findByIdAndDelete(hasLiked[0]._id)
        res.status(200).json(
            new ApiResponse(200,hasLiked[0],"unliked")
        )
    } else {
        await Likes.create({
            comment: new mongoose.Types.ObjectId(commentId),
            likedBy: req.user?._id
        })
        res.status(200).json(
            new ApiResponse(200,hasLiked[0],"liked")
        )
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    let hasLiked =await  Likes.aggregate(
        [
            {
                $match: {
                    tweet: new mongoose.Types.ObjectId(tweetId)
                }
            },
            {
                $match : {
                    likedBy : req.user?._id
                }
            }
        ]
    )

     if (hasLiked.length > 0) {
        await Likes.findByIdAndDelete(hasLiked[0]._id)
        res.status(200).json(
            new ApiResponse(200,hasLiked[0],"unliked")
        )
    } else {  await Likes.create({
        tweet: new mongoose.Types.ObjectId(tweetId),
        likedBy: req.user?._id
    })
    res.status(200).json(
        new ApiResponse(200,hasLiked[0],"liked")
    )
}
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    let likedVideos = await Likes.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true }
            }
         }])

         if (likedVideos.length === 0) {
             throw new ApiError(404, "No videos found")
         }

         res.status(200).json(
            new ApiResponse(200,likedVideos[0],"video fetched")
         )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}