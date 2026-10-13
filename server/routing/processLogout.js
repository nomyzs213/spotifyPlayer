import express from "express";
import proceedLogout from "../controllers/logout.js";


const logout = express.Router();

logout.get('api/logout' , async (req, res, next) => {
    try{
          await proceedLogout(req, res);
    }
    catch(err){ 
          return next(err);
    }
});

