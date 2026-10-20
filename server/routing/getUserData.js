import express from "express";
const userData = express.Router();

userData.get("/api/getUserData" , (req , res , next) => {
    try{
        if(!req.session.user) return res.status(200).json({user: null})
        if(req.session.user) return res.status(200).json({user: req.session.user});
    }
    catch (err){
        return next(err);
    }
})