import express from "express";
import cookieParser from 'cookie-parser';
import {clientPath} from "../server.js";
const binding = express.Router();
import {user , user_token}  from "../models/table_relations.js";
import {clearCookies} from "../controllers/cookieClearing.js";
import {getAccessTokenWithCode} from "../controllers/token_manager.js";
import {sequelize} from "../config/database.js";
import path from "node:path";

binding.use(cookieParser());
binding.get('/binding' , async (req , res) => {
    const {error , status} = req.query;
    const alreadyRegistered = req.cookies.already_registered;

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

    if(alreadyRegistered){
        try{
            await bindExistingAccount(req, res);
        }
        catch{

        }
    }

    try{
        await bindNewAccount(req , res , alreadyRegistered);
    }
    catch{

    }
})



async function bindNewAccount(req, res , alreadyRegistered) {
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

async function bindExistingAccount(req ,res){
    const {code , state} = req.query;
    const stateInCookies = req.cookies.state;

    if(!state  || !stateInCookies || !code){
        return res.status(502).redirect(path.join(clientPath, "errors/502.html"));
    }

    if(state !== stateInCookies){
        return
    }

    const userId = req.cookies.user_id;

    let accessToken ,refreshToken , accessExpiresAt, refreshExpiresAt;

    try{
        [accessToken, refreshToken  , accessExpiresAt , refreshExpiresAt] = await getAccessTokenWithCode(code);
    }
    catch(err){
        throw new Error(err.message);
    }

    try{
       const userTokens = await user_token.findOne({
            where: {
                user_id : userId
            }
       });

        await userTokens.update({
            accessToken: accessToken,
            access_token_expiry: accessExpiresAt,
            refreshToken: refreshToken,
            refresh_token_expiry: refreshExpiresAt
        });
    }
    catch (err){
        throw new Error(err.message);
    }
}


export default binding;