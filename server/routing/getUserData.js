import express from "express";
import {spotifyFetchSchema} from "../utlils/spotifyFetchSchema";
import {createError} from "../utlils/errorManager";
import DashboardLoader from "../controllers/loadSpotifyData/dashBoardInfo";
const userData = express.Router();

userData.get("/api/getUserData", (req, res, next) => {
    try {

        if (req.session && req.session.user) {
            return res.status(200).json({ user: req.session.user });
        }

        return res.status(200).json({});
    } catch (err) {
        const status = err.status || 500;
        return res.status(status).json({
            redirectError: true,
            error: { status, message: err.message }
        });
    }
});

userData.post("/api/getProfileData" ,async (req, res, next) => {
    let userProfile;
    try{
         userProfile = await DashboardLoader.getUserProfile(req, res);
    }
    catch (err){
        return res.status(err.status).json({redirectError: true, error: {status: err.status, message: err.message}});
    }

    return res.status(200).json({userProfile});

})

export default userData;