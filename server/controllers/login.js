import {user , user_token} from "../models/table_relations.js";
import bcrypt from "bcrypt";
import {Op} from "sequelize";
import {getAccessTokenWithCode} from "./token_manager.js";
import {throwError} from "../utlils/errorManager.js";
import {sessionActions} from "../utlils/session_actions.js";

async function login(req ,res){

    const loggingIdentifier = req.body.username;
    const password = req.body.password;

    if(!password || !loggingIdentifier){
        throwError("missing credentials" , 401);
    }

    const found = await user.findOne({
        where: {
            [Op.or] : [ {email: loggingIdentifier} , {username: loggingIdentifier}]
        }
    });

    if(!found){
        throwError("user not found" , 400);
    }

    const isSame = await bcrypt.compare(password, found.password_hash);

    if(!isSame){
        throwError("invalid credentials" , 400);
    }

    const foundTokens  = await user_token.findOne(
        {where: {user_id: found.id}}
    )

    if(!foundTokens){
        throwError("tokens not found" , 400);
    }

    sessionActions.createUserInstance(req , found.id , foundTokens.access_token, foundTokens.refresh_token);
    res.redirect('/dashboard');
}