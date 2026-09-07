import express from "express";
import cookieParser from 'cookie-parser';
import {clientPath} from "../server.js";
const router = express.Router();
import dotenv from "dotenv";
import {Buffer} from "node:buffer";
import {user , user_token}  from "../models/table_relations.js";

dotenv.config();

router.use(cookieParser());
router.get('/binding?status=pending' , async (req , res) => {
    const error = req.query.error;

    if(error) {
        res.redirect('/binding?status=cancelled');
        return;
    }

    await bindAccount(req, res);
})

router.get('/binding?status=cancelled',  (req, res) => {
     res.sendFile(clientPath + "/403.html");
})

async function bindAccount(req , res){
    const code = req.query.code;
    const state = req.query.state;
    const rawCookie = req.cookies.pending_registration;
    if(!rawCookie) return res.status(400).send('session expired or no cookie was set!');
    const {username , email , hashedPassword}  = JSON.parse(req.cookies.pending_registration);
    const [accessToken , refreshToken, expiresAt] = await getAccessToken(res , code);

    if(!accessToken && refreshToken && expiresAt){
        return res.status(401).json("problem with binding accounts");
    }

    const createdUser  = await user.create({
        username: username,
        email: email,
        password_hash: hashedPassword
    });

    const userToken = await user_token.create({
        id: createdUser.id,
        access_token: accessToken,
        refreshToken: refreshToken,
        expires_at: expiresAt
    });

    await userToken.setUser(createdUser);
    
    return res.status(201).json("user successfully created");

}


async function getAccessToken(res , code){
    const url = 'https://accounts.spotify.com/api/token';
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

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
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + ( Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
        body: bodyContent
    })

    if(!fetchResponse.ok) {
        res.status(400).json("problem with spotify api");
        return;
    }

    const data =  await fetchResponse.json();
    const {access_token, expires_in , refresh_token} = data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    return [access_token , refresh_token , expiresAt];

}


export default router;