import express from "express";
import cookieParser from "cookie-parser";
import {sendLinkingReq} from "../controllers/linkingReq";
const link = express.Router();
import register from "../controllers/register";
link.get("/api/link-new-account" , async (req , res) => {
    const currentlyRegistering = req.cookies.pending_registration
    let inProgress;
    try{
        if(!currentlyRegistering) {
            res.status(401).json({redirectError: true, error: {status: 401, message: "access unauthorized"}})
        }
        inProgress = await register(req, res)
    }
    catch (err){

    }
})