import {user , user_token} from "../models/table_relations.js";
import bcrypt from "bcrypt";
import {Op} from "sequelize";
import {getAccessTokenWithCode} from "./token_manager.js";
import {throwError} from "../utlils/errorManager.js";

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
        throwError("invalid login credentials" , 400);
    }

}