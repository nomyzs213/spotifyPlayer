import express from "express";
import proceedLogout from "../controllers/logout.js";


const logout = express.Router();

logout.post('/api/logout' , async (req, res, next) => {
    try{
          await proceedLogout(req, res);
          return res.status(200).json({redirect: true, location:"/index.html"});
    }
    catch(err){
        return res.status(err.status).json({redirectError: true, error: {status: err.status , message: err.message}});
    }
});

