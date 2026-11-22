import {user, user_token} from "../models/table_relations.js";
import bcrypt from "bcrypt";
import pkg from "sequelize";
import {throwError} from "../utlils/errorManager.js";
import {sessionActions} from "../utlils/session_actions.js";
import DashboardLoader from  "./loadSpotifyData/dashBoardInfo.js"

const { Op } = pkg;

async function login(req ,res){

    const email = req.body.email;
    const password = req.body.password;

    if(!password || !email){
        throwError("missing credentials" , 401);
    }

    const found = await user.findOne({
        where: {
            email: email
        }
    });

    if(!found){
        return res.status(400).json({message: "user of given credentials does not exist" , status: 400});
    }

    const isSame = await bcrypt.compare(password, found.password_hash);

    if(!isSame){
        return res.status(400).json({message: "invalid credentials" , status: 400})
    }

    const foundTokens  = await user_token.findOne(
        {where: {user_id: found.id}}
    )

    if(!foundTokens){
        throwError("tokens not found" , 400);
    }
    console.log("found tokens:" , foundTokens , "\n");

    sessionActions.createUserInstance(req , found.id , foundTokens.access_token, foundTokens.refresh_token);
    req.session.profile = await DashboardLoader.getUserProfile(req, res, true);
    console.log(req.session);

    res.status(201).json({success: true});
}

export default login;