import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../module/user.models.js";
import { Subscription } from "../module/subscriber.modules.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../module/video.models.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // TODO: toggle subscription
    console.log("User", channelId);
    const isSubscribed = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
        },

        {
            $match :{
                subscriber: req.user?._id
            }
        }
    ]);
    
    let deleteit
    if (isSubscribed && isSubscribed.length) {
        
      
       deleteit= await Subscription.findByIdAndDelete(isSubscribed[0]._id);
      res.status(200).json(
        new ApiResponse(200,deleteit,"unsubscribed")
      )
    } else {
        await Subscription.create({
            channel: channelId,
            subscriber: req.user?._id,
        });
        res.status(200).json(
            new ApiResponse(200,{},"subscribed")
          )
     
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
   let subscriberList =await Subscription.aggregate([
        {
            $match:{
                channel :new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "subscriber",
                foreignField: "_id",
                as :"Userdetail",
                pipeline:[
                    {
                        $project : {
                            username:1,
                            fullName:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                "userdetail" : { $arrayElemAt: ["$Userdetail", 0] }
            }
        },
        {
            $project : {
                "userdetail" :1
            }
        }
    ])
    console.log(subscriberList);
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
   let SubscriberToList = await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "channel",
                foreignField:"_id",
                as:"MeSubscribedToList",
                pipeline:[
                    {
                        $project : {
                            username:1,
                            fullName:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                "meSubscribetTo" : { $arrayElemAt: ["$MeSubscribedToList", 0] }
            }
        },
        {
            $project : {
                "meSubscribetTo" :1
            }
        }
    ])

    res.json(
        new ApiResponse(200,SubscriberToList,"success")
    )
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
