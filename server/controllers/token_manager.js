import {Buffer} from "node:buffer";
import dotenv from "dotenv";
import {user, user_token} from "../models/table_relations.js";

dotenv.config();

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
        throw new Error('problem with spotify api')
    }

    const data =  await fetchResponse.json();
    const {access_token, expires_in , refresh_token} = data;
    const accessExpiresAt = new Date(Date.now() + expires_in * 1000);
    const refreshExpiresAt = new Date(Date.now() + 3600 * 24 * 180 * 1000);

    return [access_token , refresh_token , accessExpiresAt ,refreshExpiresAt];

}

export async function getAccessTokenWithRefresh(res, refreshToken){
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
                refresh_token: refreshToken
            }
        ).toString()
    })

    if(!result.ok){
        throw new Error("problem with spotify api");
    }

    const data = await result.json();

    const {access_token, expires_in , refresh_token} = data;

    const accessExpiresAt = new Date(Date.now() + expires_in * 1000);

    return [access_token ,refresh_token, accessExpiresAt];

}

export async function setTokens(userId , accessToken, refreshToken , accessExpiresAt) {
    const found = await user.findByPk(userId);

    if (!found) {
        throw new Error("problem with db");
    }
    const userTokens = await user_token.findOne({
        where: {
            user_id: found.id
        }
    });

    const updated = await userTokens.update({
        accessToken: accessToken,
        access_token_expiry: accessExpiresAt,
        refreshToken: refreshToken
    });

    if (!updated) {
        throw new Error("problem with db");
    }

}