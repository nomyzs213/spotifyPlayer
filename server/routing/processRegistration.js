import express from "express";
import register from "../controllers/register.js";
const proceedRegistration = express.Router();

proceedRegistration.post("api/register" , async (req, res, next) => {
    try{
        await register(req, res);
    }
    catch (err){
        return res.status(err.status).json({redirectError: true, error: {status: err.status , message: err.message}});
    }
});

export default proceedRegistration;