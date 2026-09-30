import {user_token} from "../models/table_relations.js";
import {throwError} from "./errorManager.js";

export default  async function areCodesExpired(userId){
    const found = await user_token.findOne({
        where: {user_id: userId}
    });

    if(!found) {
        throwError(`cant find a user's tokens with id: ${userId}` , 400);
    }

    const accessTokenExpiry =  new Date(found.access_token_expiry);
    const refreshTokenExpiry =  new Date(found.refresh_token_expiry);

    if(refreshTokenExpiry <= Date.now()) return [true , "REFRESH_TOKEN" , found.refresh_token];
    if(accessTokenExpiry <= Date.now()) return [true , "ACCESS_TOKEN" , found.access_token];

    return [false, null, null];
}




