import express from "express";
import proceedLogout from "../controllers/logout.js";
import { createError } from "../utlils/errorManager.js";

const logout = express.Router();

logout.get('/logout' , async (req, res, next) => {
    try{
          await proceedLogout(req, res);
    }
    catch(err){ 
          return next(err);
    }
});

