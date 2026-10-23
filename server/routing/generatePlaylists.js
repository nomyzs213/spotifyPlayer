import express from "express";
import playlistManager from "../controllers/loadSpotifyData/playlistManager.js";
import path from "node:path";
import {clientPath} from "../server.js";
const playlistGenerator = new express.Router();


playlistGenerator.get("/generatePlaylist" , (req ,res)=> {
    res.sendFile(path.join(clientPath, "generatePlaylists.html"));
});

playlistGenerator.get("/api/generatePlaylist" , async (req , res, next) =>  {
    try{
        await playlistManager.proceed(req, res);
    }
    catch (err){
        return res.status(err.status).json({redirectError: true, error: {status: err.status , message: err.message}});
    }
})

export default playlistGenerator;