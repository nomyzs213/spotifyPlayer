import express from "express";
import DashboardLoader from "../controllers/loadSpotifyData/dashBoardInfo.js";
const userData = express.Router();



userData.post("/api/getProfileData" ,async (req, res) => {
    let userProfile;

    const accessToken = req.session?.user?.accessToken;
    if(!accessToken) return res.status(200).json({profile: null})

    if(req.session.profile) return res.status(200).json({profile: req.session.profile});


    try{
         userProfile = await DashboardLoader.getUserProfile(req, res, true);
    }
    catch (err){
        console.log(err);
        return res.status(err.status? err.status : 400).json({redirectError: true, error: {status: err.status, message: err.message}});
    }
    if(!req.session.profile) req.session.profile = userProfile
    return res.status(200).json({profile: req.session.profile});

})

export default userData;