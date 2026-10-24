import express from "express";
import path from "node:path";
import {clientPath} from "../server.js";
import login from "../controllers/login.js";
const proceedLogin =  express.Router();


proceedLogin.get('/login', (req, res) => {
    res.sendFile(path.join(clientPath, "login.html"));
});

proceedLogin.get('/api/login', async (req , res , next) => {
    try{
        await login(req, res);
    }
    catch (err){
        return res.status(err.status).json({redirectError: true, error: {status: err.status , message: err.message}});
    }
})

export default proceedLogin;