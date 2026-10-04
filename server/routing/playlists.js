import express from "express";
import playlistManager from "../controllers/loadSpotifyData/playlistManager.js";
const router = express.Router();

router.get('/api/getPlaylists' , async (req, res, next) => {
    let playlists;
    try{
        playlists = await playlistManager.getUserPlaylists(req, res);
    }
    catch (err){
        return next(err);
    }

    res.status(200).json({
        playlists: playlists
    });

})

router.get('/api/generatePlaylists' , async (req, res , next) => {
    try{
        await playlistManager.proceed(req, res);
    }
    catch (err){
        return next(err);
    }
});