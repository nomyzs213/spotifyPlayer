import bcrypt  from "bcrypt";
import dotenv from "dotenv";
import {user} from "../models/user.js";
import {Op} from "sequelize";
import {sendLinkingReq} from "./linkingReq.js";
import {isHttps} from "../config/cookieInfo.js";

dotenv.config();

async function register(req , res){
    let {username , email , password} = req.body.registrationData;
    if(!username || !email || !password) return res.status(400).json("cant register without email or username");

    if(username.toLowerCase() === username && username.length >= 3 && email.length >= 3 && email.toLowerCase() === email && password.length >= 8) {
        username = username.toLowerCase().replace(/\s+/g , "");
        email = email.toLowerCase().replace(/\s+/g , "");
        password = password.replace(/\s+/g , "");

        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const alreadyExists = await user.findOne({
                where: {
                    [Op.or] : [ {username: username} , {email: email}]}
            });

            if(alreadyExists) {
                return res.status(409).json("account with that email already exists");
            }

            const cookie = {username , email , hashedPassword};
            res.cookie('pending_registration' , cookie , {httpOnly: true, secure: isHttps , maxAge: 1000 * 60 * 30});
            await sendLinkingReq(req , res);


        }
        catch (error){
            console.log(error);
            return res.status(500).json("database error");
        }
    }
    else{
        return res.status(400).json("cant register when email or username is invalid");
    }
}
