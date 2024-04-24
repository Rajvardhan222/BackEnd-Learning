import mongoose, { mongo } from "mongoose";
import { Video } from "../module/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";


const uploadVideo = asyncHandler(async (req, res) => {
    let { title, description, isPublished } = req?.body;
    let { video, thumbnail } = req?.files;
    if ([title, description, isPublished].some((data) => data === "")) {
        throw new ApiError(401, "Title is required");
    }

    let uploadedVideo = await uploadOnCloudinary(video[0].path);
    if (!uploadedVideo) {
        fs.unlinkSync(thumbnail.path);
        throw new ApiError(
            505,
            "We are offline on our side :: Not able to upload on cloudinary :: video"
        );
    }
    let uploadedThumbnail = await uploadOnCloudinary(thumbnail[0].path);

    if (!uploadedThumbnail) {
        throw new ApiError(
            505,
            "We are offline on our side :: Not able to upload on cloudinary :: thumbnail"
        );
    }
    const { duration } = uploadedVideo;
    console.log("uploaded Video", uploadedVideo);

    let videoData = await Video.create({
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        title,
        description,
        duration,
        isPublished,
        owner: req.user?._id,
    });

    console.log(videoData);
    res.status(200).json(
        new ApiResponse(200, {}, "Video UPloaded Successfully")
    );
});

const updateVideoData = asyncHandler(async (req, res) => {
    let {videoId} = req?.params
    let {title,description} = req.body
    if (!(title || description)) {
        throw new ApiError(400,"Any one is required title or description")
    }
    console.log(videoId);
   // Assuming title and description are variables containing the new values, and videoId is the ID of the video document
let updateFields = {};

// Check if title is provided
if (title) {
  updateFields.title = title;
}

// Check if description is provided
if (description) {
  updateFields.description = description;
}

// Update the document with the provided fields
let updateVideo = await Video.findByIdAndUpdate(
  videoId,
  updateFields,
  { new: true }
);

    if (!updateVideo) {
        throw new ApiError(500,"failed")
    }

    res.status(200).json(
        new ApiResponse(200,updateVideo,"successfully updated")
    )
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
   if (!videoId) {
    throw new ApiError(400,"invalid Video LInk")
   }

   let video =await Video.findById(videoId)
console.log(video);
  let deleteVideo =await deleteOnCloudinary(video.videoFile,"video")
       
      let deleteImage = await  deleteOnCloudinary(video.thumbnail)

     let deletedDocVideo=await Video.findByIdAndDelete(new mongoose.Types.ObjectId(videoId))
     res.status(200).json(
        new ApiResponse(200,deletedDocVideo,"deleted")
     )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // toggle video
   let video =await Video.findById(videoId)
   if (!video) {
    throw new ApiError(400, "Invalid Video Link: Video not found");
}
   let toogle = video.isPublished
   video.isPublished = !toogle
  let vid =await video.save()
   res.status(200).json(new ApiResponse(200,vid,"success"))
})

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 1, query, sortBy, sortType, userId } = req.query
    const sort = {};
sort[sortBy] = parseInt(sortType);
    let pipeline =  Video.aggregate([
        {
            "$match" :{
                "owner" : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort :sort
        },
        {
            "$lookup":{
                "from" : "users",
                "localField" : "owner",
                "foreignField" : "_id",
                "as":"creatorOwner",
                pipeline: [
                    {
                      $project: {
                        "username": 1,
                        "avatar": 1,
                      },
                    },
                  ],
                
                  
               
            }
        },
        
        {
            "$project": {
                "videoFile": 1,
                "thumbnail": 1,
                "title": 1,
                "description": 1,
                "duration": 1,
                "views": 1,
                "isPublished": 1,
               
                "creatorOwner" :1
                
                
              
            }
          } ,
          {
            $unwind:"$creatorOwner"
          }
         
    ])
    const options={
        page : parseInt(page,1),
        limit : parseInt(limit,10)
    }
    console.log('pipeline',pipeline);
    Video.aggregatePaginate(pipeline,options).then((response)=>{

        res.status(200).json(
            new ApiResponse(200,response,"List of videos")
        )
    })
})
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})
export { uploadVideo ,updateVideoData,deleteVideo,togglePublishStatus,getAllVideos,getVideoById};
