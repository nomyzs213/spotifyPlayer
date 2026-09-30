import DashboardLoader from "../controllers/loadSpotifyData/dashBoardInfo.js";
import express from "express";
import path from "node:path";
import {clientPath} from "../server";

const dashboardHandler =  express.Router();

dashboardHandler.get("/dashboard" , (req , res) => {
    res.sendFile(path.join(clientPath, "dashboard.html"));
});

dashboardHandler.post("/api/dashboard" , async (req , res) => {
    const result = await DashboardLoader.loadDashBoard(req, res);
    res.status(200).json(result);
});

export default dashboardHandler;