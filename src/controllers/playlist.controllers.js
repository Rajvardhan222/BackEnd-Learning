import mongoose, { isValidObjectId, mongo } from "mongoose";
import { Playlist } from "../module/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../module/video.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    //TODO: create playlist

    if (!name) {
        throw new ApiError(401, "Name is required");
    }
    if (!description) {
        throw new ApiError(401, "Description is required");
    }
    let playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id,
    });

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist created successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId, limit = 10, pages = 1 } = req.params;
    //TODO: get user playlists
    let fetchedPlaylist = Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
    ]);
    const options = {
        pages,
        limit,
    };
    let paginatedPlaylist = await Playlist.aggregatePaginate(
        fetchedPlaylist,
        options
    );

    res.status(200).json(
        new ApiResponse(200, paginatedPlaylist, "Playlist fetched succeddfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id
    let fetchedPlaylist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
            },
        },
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            fetchedPlaylist,
            "Playlist by Id fetched succeddfully"
        )
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!playlistId && !videoId) {
        throw new ApiError(400, "Playlist or Video not provided");
    }
    let playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(401, "Invalid Playlist");
    }
    let isVideoThere = await Video.findById(videoId);
    if (!isVideoThere) {
        throw new ApiError(401, "Invalid Video Id");
    }

    playlist.videos.push(new mongoose.Types.ObjectId(videoId));
    let saveVideo = await playlist.save();
    if (!saveVideo) {
        throw new ApiError(
            500,
            "Something went wrong while adding video to the playlist"
        );
    }

    res.status(201).json(new ApiResponse(201, {}, "Added Video To playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
    if (!playlistId && !videoId) {
        throw new ApiError(400, "Playlist or Video not provided");
    }
    let playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(401, "Invalid Playlist");
    }
    let isVideoThere = await Video.findById(videoId);
    if (!isVideoThere) {
        throw new ApiError(401, "Invalid Video Id");
    }

    playlist.videos.filter((id) => id !== isVideoThere._id);
    let saveDeletedVideoPlaylist = await playlist.save();
    if (!saveDeletedVideoPlaylist) {
        throw new ApiError(
            500,
            "Something went wrong while deleting video from the playlist"
        );
    }

    res.status(201).json(
        new ApiResponse(201, {}, `deleted Video from playlist ${playlist.name}`)
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist
    if (!playlistId) {
        throw new ApiError(400, "Playlist not provided");
    }
    let playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(401, "Invalid Playlist");
    }
    let deletePlayList = await Playlist.findByIdAndDelete(playlist._id);
    if (!deletePlayList)
        throw new ApiError(500, "something went wrong while deleting playlist");
    res.status(200).json(
        new ApiResponse(
            200,
            {},
            `deleted ${playlist.name} playlist successfully`
        )
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist
    if (!playlistId && !(name || description)) {
        throw new ApiError(400, "Playlist not provided");
    }
    let playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(200, "Invalid Playlist provided");
    }
    let updatePLaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $or: [{ name }, { description }],
    });
    if (!updatePLaylist) {
        throw new ApiError(500, "Unable to update playlist currently");
    }
    res.status(200).json(
        new ApiResponse(200, {}, "Playlist Updated Successfully")
    );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
