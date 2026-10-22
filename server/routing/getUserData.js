import express from "express";
const userData = express.Router();

userData.post("/api/getUserData" , (req , res , next) => {
    try{
        if(!req.session) return res.status(200).json({})
        if(req.session.user) return res.status(200).json({user: req.session.user});
    }
    catch (err){
        return next(err);
    }
})

export default userData;