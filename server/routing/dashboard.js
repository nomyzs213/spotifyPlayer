import DashboardLoader from "../controllers/loadSpotifyData/dashBoardInfo.js";
import express from "express";

const dashboardHandler =  express.Router();

dashboardHandler.get("/api/dashboard" , async (req , res) => {
    const result = await DashboardLoader.loadDashBoard(req, res);
    res.status(200).json(result);
});

