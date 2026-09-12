import bcrypt  from "bcrypt";
import {user} from "../models/user.js";
import {Op} from "sequelize";
import {sendLinkingReq} from "./linkingReq.js";
import {isHttps} from "../config/cookieInfo.js";
import {throwError} from "../utlils/errorManager.js";



async function register(req , res){
    let {username , email , password} = req.body.registrationData;
    if(!username || !email || !password) throwError("invalid login credentials" , 400);

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
                throwError("user already exists" , 409);
            }

            const cookie = {username , email , hashedPassword};
            res.cookie('pending_registration' , cookie , {httpOnly: true, secure: isHttps , maxAge: 1000 * 60 * 30});
            await sendLinkingReq(req , res);


        }
        catch (err){
            throwError("db error" , 500);
        }
    }
    else{
        throwError("invalid login credentials" , 400);
    }
}
