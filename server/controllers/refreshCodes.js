import {getAccessTokenWithCode, getAccessTokenWithRefresh} from "./token_manager.js";
import areCodesExpired from "../utlils/areCodesExpired.js";
import {throwError} from "../utlils/errorManager.js";
import {sendLinkingReq} from "./linkingReq.js";
import {sessionActions} from "../utlils/session_actions.js";

class RefreshCodes{
    async #refreshAccessToken(req){
        const user = req.session.user;
        if(!user) throwError("user not found , to access this user needs to login" , 401);
            await getAccessTokenWithRefresh(req.session.refreshToken, user.id);
           const successful = await sessionActions.updateTokens(req);
           if(!successful) throwError("problem with session" , 500);
    }

    async #refreshRefreshToken(req , res){
            await sendLinkingReq(req , res , true);
        const successful = await sessionActions.updateTokens(req);
        if(!successful) throwError("problem with session" , 500);
    }

    async refreshTokens(req, res, areCodesExpired){
        const [isExpired , tokenName] = areCodesExpired;
        if(!isExpired) return false;

        if(tokenName === "ACCESS_TOKEN"){
            await this.#refreshAccessToken(req);
            return true;
        }
        if(tokenName === "REFRESH_TOKEN"){
            await this.#refreshRefreshToken(req, res);
            return true;
        }
        return null;
    }
}

const refreshing = new RefreshCodes();
export default refreshing;