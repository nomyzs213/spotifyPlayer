import DashboardLoader from "../controllers/loadSpotifyData/dashBoardInfo.js";
import express from "express";

const dashboardHandler =  express.Router();

dashboardHandler.post("/api/dashboard" , async (req , res) => {
    console.log(req.cookies, "/n");
    console.log(req.session);
    let result;
    try{
        result = await DashboardLoader.loadDashBoard(req, res);
    }
    catch (err){
        return res.status(err.status).json({redirectError: true, error: {status: err.status , message: err.message}});
    }
    res.status(200).json(result);
});

export default dashboardHandler;