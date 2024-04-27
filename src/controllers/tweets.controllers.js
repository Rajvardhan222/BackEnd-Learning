import mongoose, { isValidObjectId } from "mongoose"
import { Tweets} from "../module/tweets.models.js"
import {User} from "../module/user.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    let {tweet} = req.body

    if (!tweet) {
        throw new ApiError(401, "Tweet is required");
    }

    let newTweet = await Tweets.create({
        content: tweet,
        owner: req.user?._id
    })
    if (!newTweet) {
        throw new ApiError(500, "Something went wrong while creating tweet");
    }

    res.status(201).json(newTweet)
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    let {userId, limit = 10, pages = 1} = req.params

   let tweets = Tweets.aggregate(
        [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "creatorOwner",
                    pipeline : [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                avatar: 1,
                            }
                        }
                    ]
                }
            }
        ]
    )

  let paginatedTweets =await  Tweets.aggregatePaginate(tweets,{pages,limit})

  if (!paginatedTweets) {
    throw new ApiError(404, "Tweets not found")
  }

  res.status(200).json(new ApiResponse(200,paginatedTweets,"success"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    let {tweetId} = req.params
    let {content} = req.body

    if (!content) {
        throw new ApiError(401, "Content is required");
    }

    let updatedTweet = await Tweets.findByIdAndUpdate(tweetId,{
        content: content
    },{
        new: true
    })

    if (!updatedTweet) {
        throw new ApiError(500, "Something went wrong while updating tweet");
    }

    res.status(200).json(new ApiResponse(200,updatedTweet,"success"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    let {tweetId} = req.params

    let deletedTweet = await Tweets.findByIdAndDelete(tweetId)

    if (!deletedTweet) {
        throw new ApiError(500, "Something went wrong while deleting tweet");
    }

    res.status(200).json(new ApiResponse(200,deletedTweet,"success"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}