import {createError} from "../utlils/errorManager.js";
import areCodesExpired from "../utlils/areCodesExpired.js";
import {getAccessTokenWithRefresh} from "../controllers/token_manager.js";

export default async function bindCodes(req ,res , next){
    const user = req.session.user;

    if(!user){
        return next(createError("user not set in session") , )
    }

    let isExpired , tokenName, token;

    try {
         [isExpired , tokenName, token]  = areCodesExpired();
    }
    catch (err){
        return next(err);
    }


    if(!isExpired) {
        return ;
    }

    if(tokenName === "ACCESS_TOKEN"){
        try{
            await getAccessTokenWithRefresh(token , user.id);
        }
        catch(err){
            next(err);
        }
    }


}