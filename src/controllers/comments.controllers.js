import mongoose from "mongoose";
import { Comments } from "../module/comments.modules.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../module/video.models.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

   let videoComments =  Comments.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetail",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
    ]);
    let options = {
        page,
        limit
    }
   let paginatedComments =await Comments.aggregatePaginate(videoComments,options)

    res.status(200).json(
        new ApiResponse(200, paginatedComments, "Comments fetched succeddfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "Invalid Video Link");
    }
    const { comment } = req.body;
    if (!comment) {
        throw new ApiError(400, "Comment not provided");
    }

    let video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Invalid Video Link: Video not found");
    }

    let newComment = new Comments({
        content :comment,
        video: new mongoose.Types.ObjectId(videoId),
        owner: new mongoose.Types.ObjectId(req.user?._id),
    });
    let saveComment = await newComment.save();
    if (!saveComment) {
        throw new ApiError(
            500,
            "Something went wrong while adding comment to the video"
        );
    }
  
    res.status(201).json(
        new ApiResponse(201, saveComment, `comment added to video `)
    );
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(400, "Invalid Comment Link");
    }
    const { comment } = req.body;
    if (!comment) {
        throw new ApiError(400, "Comment not provided");
    }

  let updateComment =await  Comments.findByIdAndUpdate(commentId,{
        content : comment
    },{
        new :true
    })

    if (!updateComment) {
        throw new ApiError(
            500,
            "Something went wrong while updating comment to the video"
        );
    }

    res.status(200).json(
        new ApiResponse(200, {}, `comment updated to video `)
    )
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(400, "Invalid Comment Link");
    }
    let deletedCOmment =await Comments.findByIdAndDelete(commentId)

    if (!deletedCOmment) {
        throw new ApiError(
            500,
            "Something went wrong while deleting comment to the video"
        );
    }

    res.status(200).json(
        new ApiResponse(200, {}, `comment deleted to video `)
    )
});

export { getVideoComments, addComment, updateComment, deleteComment };
