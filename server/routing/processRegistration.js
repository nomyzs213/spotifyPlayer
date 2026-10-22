import express from "express";
import register from "../controllers/register.js";
import {clientPath} from "../server.js";
import path from "node:path";
const proceedRegistration = express.Router();


proceedRegistration.get("/register" , (req , res) => {
    res.sendFile(path.join(clientPath, "register.html"));
})
proceedRegistration.get("api/register" , async (req, res, next) => {
    try{
        await register(req, res);
    }
    catch (err){
        return next(err);
    }
});

export default proceedRegistration;