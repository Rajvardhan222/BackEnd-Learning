import { Router } from "express";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controllers.js";

let router = Router()

router.route('/create').post(varifyJWT,createPlaylist)
router.route('/get-user-playlist/:userId/:limit/:pages').post(varifyJWT,getUserPlaylists)
router.route('/add-video/:playlistId/:videoId').post(varifyJWT,addVideoToPlaylist)
router.route('/remove-video/:playlistId/:videoId').post(varifyJWT,removeVideoFromPlaylist)
router.route('/get-playlist-by-id/:playlistId').post(varifyJWT,getPlaylistById)
router.route('/delete/:playlistId').post(varifyJWT,deletePlaylist)
router.route('/update/:playlistId').post(varifyJWT,updatePlaylist)


export default router