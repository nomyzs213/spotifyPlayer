import {Buffer} from "node:buffer";
import {user, user_token} from "../models/table_relations.js";
import {throwError} from "../utlils/errorManager.js";

const clientSecret = process.env.CLIENT_SECRET;
const clientId = process.env.CLIENT_ID;

export async function getAccessTokenWithCode(code){
    const url = 'https://accounts.spotify.com/api/token';

    const bodyContent = new URLSearchParams(
        {
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
        }
    ).toString();

    const fetchResponse = await fetch(url , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + ( Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
        body: bodyContent
    })

    if(!fetchResponse.ok) {
        throwError("problem with spotify api" , 502);
    }

    const data =  await fetchResponse.json();
    const {access_token, expires_in , refresh_token} = data;
    const accessExpiresAt = new Date(Date.now() + expires_in * 1000);
    const refreshExpiresAt = new Date(Date.now() + 3600 * 24 * 180 * 1000);

    return [access_token , refresh_token , accessExpiresAt ,refreshExpiresAt];

}

export async function getAccessTokenWithRefresh(oldToken, userId){
    const url = "https://accounts.spotify.com/api/token";

    const result = await fetch(url , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + ( Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
        body: new URLSearchParams(
            {
                grant_type: 'refresh_token',
                refresh_token: oldToken
            }
        ).toString()
    })

    if(!result.ok){
        throwError("problem with spotify api" , 502);
    }

    const data = await result.json();

    const {access_token, expires_in , refresh_token} = data;
    const accessExpiresAt = new Date(Date.now() + expires_in * 1000);


    if(refresh_token !== oldToken && refresh_token !== undefined){
        try{
            await user_token.update({
                access_token: access_token,
                access_token_expiry: accessExpiresAt,
                refresh_token: refresh_token
            }, {
                where: {
                    user_id: userId
                }
            });

        }
        catch (err){
            throwError("db error" , 500);
        }

        return [access_token, refresh_token, accessExpiresAt];

    }
    else{
        try{
            await user_token.update({
                access_token: access_token,
                access_token_expiry: accessExpiresAt
            }, {
                where : {
                    user_id: userId
                }
            })
        }
        catch(err){
            throwError("db error" , 500);
        }

        return [access_token ,oldToken , accessExpiresAt];
    }


}

export async function setTokens(userId , accessToken, refreshToken , accessExpiresAt) {
    const found = await user.findByPk(userId);

    if (!found) {
        throwError("db error" , 500);
    }
    const userTokens = await user_token.findOne({
        where: {
            user_id: found.id
        }
    });

    const updated = await userTokens.update({
        access_token: accessToken,
        access_token_expiry: accessExpiresAt
    });

    if (!updated) {
        throwError("db error" , 500);
    }

}