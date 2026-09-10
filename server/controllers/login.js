import {user , user_token} from "../models/table_relations.js";
import bcrypt from "bcrypt";
import {Op} from "sequelize";
import {getAccessTokenWithCode} from "./token_manager.js";

async function login(req ,res){
    const loggingIdentifier = req.body.username;
    const password = req.body.password;

    if(!password || !loggingIdentifier){
        return res.status(401).json("required data wasn't passed");
    }

    const found = await user.findOne({
        where: {
            [Op.or] : [ {email: loggingIdentifier} , {username: loggingIdentifier}]
        }
    });

    if(!found){
        return res.status(400).json("user not found");
    }

    const isSame = await bcrypt.compare(password, found.password_hash);

    if(!isSame){
        return res.status(400).json("invalid credentials");
    }

}