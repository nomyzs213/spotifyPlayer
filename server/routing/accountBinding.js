import express from "express";
import cookieParser from 'cookie-parser';
import {clientPath} from "../server.js";
const binding = express.Router();
import dotenv from "dotenv";
import {user , user_token}  from "../models/table_relations.js";
import {clearCookies} from "../controllers/cookieClearing.js";
import {getAccessTokenWithCode} from "../controllers/token_manager.js";
import {sequelize} from "../config/database.js";
import path from "node:path";
dotenv.config();

binding.use(cookieParser());
binding.get('/binding' , async (req , res) => {
    const {error , status} = req.query;

    if(status === "canceled"){
         clearCookies(res , "pending_registration" , "state");
        res.sendFile(path.join(clientPath , "errors/403.html"));
        return;
    }

    if(error) {
         clearCookies(res , "pending_registration" , "state");
        res.sendFile(path.join(clientPath , "errors/403.html"));
        return;
    }

    try{
        await bindAccount(req , res);
    }
    catch(err){
        console.error(err);
    }
})



async function bindAccount(req, res) {
    const code = req.query.code;
    const state = req.query.state;
    const stateInCookies = req.cookies.state;


    if (!state || !stateInCookies || stateInCookies !== state) {
         clearCookies(res, 'pending_registration', 'state');
        return res.status(400).json("unauthorized connection");
    }


    const rawCookie = req.cookies.pending_registration;
    if (!rawCookie) {
         clearCookies(res, 'state');
        return res.status(400).send('session expired or no cookie was set!');
    }

    const { username, email, hashedPassword } = rawCookie;


    let accessToken, refreshToken, accessExpiresAt, refreshExpiresAt;
    try {
        [accessToken, refreshToken, accessExpiresAt ,refreshExpiresAt ] = await getAccessTokenWithCode(code);
    } catch (error) {
        console.error("Spotify token exchange error:", error.message);
         clearCookies(res, "pending_registration", "state");
        return res.status(502).json("problem with spotify api");
    }


    const t = await sequelize.transaction();
    try {
        const createdUser = await user.create({
            username: username,
            email: email,
            password_hash: hashedPassword
        }, { transaction: t });

        await user_token.create({
            user_id: createdUser.id,
            access_token: accessToken,
            refresh_token: refreshToken,
            access_token_expiry: accessExpiresAt,
            refresh_token_expiry:refreshExpiresAt
        }, { transaction: t });

        await t.commit();

        clearCookies(res, 'pending_registration', 'state');
        return res.status(201).json("user successfully created");

    } catch (error) {
        await t.rollback();
        console.error("Database transaction error:", error);
        clearCookies(res, 'pending_registration', 'state');
        return res.status(500).json('database error');
    }
}



export default binding;