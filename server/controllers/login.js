import {user , user_token} from "../models/table_relations.js";
import bcrypt from "bcrypt";
import {Op, where} from "sequelize";

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

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const isSame = await bcrypt.compare(hashed, found.password);

    if(!isSame){
        return res.status(401).json("passwords do not match");
    }

    const userToken = await user_token.find({
        id: found.id
    })

    const {accessToken , expires_at} = userToken;


}