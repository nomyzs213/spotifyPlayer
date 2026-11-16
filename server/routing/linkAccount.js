import express from "express";

import {sendLinkingReq} from "../controllers/linkingReq.js";
import {clearCookies} from "../utlils/cookieClearing.js";
const link = express.Router();


link.get("/api/link-account" , async (req , res) => {
    const currentlyRegistering = req.cookies.pending_registration;
    const isRegistered = req.query.alreadyRegistered;
    try{
        if(!currentlyRegistering) {
            res.status(401).json({redirectError: true, error: {status: 401, message: "access unauthorized"}});
            return;
        }

        await sendLinkingReq(req, res, isRegistered)
    }
    catch (err){
        clearCookies(res, "pending_registration" , "state");
        res.status(err.status).json({redirectError: true, error:{status: err.status, message: err.message}});
    }
});

export default link;