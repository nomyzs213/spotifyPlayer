import express from "express";
import playlistManager from "../controllers/loadSpotifyData/playlistManager.js";
const loadPlaylists = express.Router();


loadPlaylists.get('/api/getPlaylists' , async (req, res, next) => {
    let playlists;
    try{
        playlists = await playlistManager.getUserPlaylists(req, res);
    }
    catch (err){
        return res.status(err.status).json({redirectError: true, error: {status: err.status , message: err.message}});
    }

    res.status(200).json({
        playlists: playlists
    });

})

loadPlaylists.get('/api/generatePlaylists' , async (req, res , next) => {
    try{
        await playlistManager.proceed(req, res);
    }
    catch (err){
        return res.status(err.status).json({redirectError: true, error: {status: err.status , message: err.message}});
    }
});


export default loadPlaylists;