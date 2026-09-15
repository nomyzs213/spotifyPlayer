import express from "express";
import cookieParser from 'cookie-parser';
import {clientPath} from "../server.js";
const binding = express.Router();
import {user , user_token}  from "../models/table_relations.js";
import {clearCookies} from "../utlils/cookieClearing.js";
import {getAccessTokenWithCode} from "../controllers/token_manager.js";
import {sequelize} from "../config/database.js";
import path from "node:path";
import {throwError, createError} from "../utlils/errorManager.js";
import {where} from "sequelize";
import {generateSessionToken} from "../utlils/generateSessionToken.js";

binding.use(cookieParser());
binding.get('/binding' , async (req , res , next) => {

    if(!req.query.code){
        next(createError("unauthorized request" , 401));
    }
    const {error , status} = req.query;
    const alreadyRegistered = req.cookies.already_registered;

    if(status === "canceled"){
        clearCookies(res , "pending_registration" , "state");
        return next(createError("binding cancelled" , 500));
    }

    if(error) {
         clearCookies(res , "pending_registration" , "state");
         return next(createError("problem with spotify api" , 502));
    }

    if(alreadyRegistered === 'true'){
        try{
            await bindExistingAccount(req, res);
        }
        catch(err){
            return next(err);
        }
    }
    else{
        try{
            await bindNewAccount(req , res , alreadyRegistered);
        }
        catch(err){
            return next(err);
        }
    }

})



async function bindNewAccount(req, res) {
    const code = req.query.code;
    const state = req.query.state;
    const stateInCookies = req.cookies.state;


    if (!state || !stateInCookies || stateInCookies !== state) {
         clearCookies(res, 'pending_registration', 'state');
        throwError("missing params from req.query or from req.cookies" , 400);
    }


    const rawCookie = req.cookies.pending_registration;
    if (!rawCookie) {
         clearCookies(res, 'state');
        throwError("session expired or cookie is missing" , 400);
    }

    const { username, email, hashedPassword } = rawCookie;


    let accessToken, refreshToken, accessExpiresAt, refreshExpiresAt;
    try {
        [accessToken, refreshToken, accessExpiresAt ,refreshExpiresAt ] = await getAccessTokenWithCode(code);
    } catch (error) {
         clearCookies(res, "pending_registration", "state");
        throwError("problem with spotify api" , 502);
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


    } catch (err) {
        await t.rollback();
        throwError("db error" , 500);
    }
    finally {
        clearCookies(res, 'pending_registration' , 'state');
        res.redirect('/login');
    }
}

async function bindExistingAccount(req ,res){
    const {code , state} = req.query;
    const stateInCookies = req.cookies.state;

    if(!state  || !stateInCookies || !code){
        throwError("missing params from req.query or from cookies" , 400);
        clearCookies(res, 'pending_registration' , 'state');
    }

    if(state !== stateInCookies){
        throwError("states in cookie is not equal to the one in request" , 400);
        clearCookies(res, 'pending_registration' , 'state');
    }

    const userId = req.cookies.user_id;

    let accessToken ,refreshToken , accessExpiresAt, refreshExpiresAt;

    try{
        [accessToken, refreshToken  , accessExpiresAt , refreshExpiresAt] = await getAccessTokenWithCode(code);
    }
    catch(err){
        throwError("missing tokens" , 400);
        clearCookies(res, 'pending_registration' , 'state');
    }

    try{
       const userTokens = await user_token.findOne({
           where: {
               user_id: userId
           }
       });

        await userTokens.update({
            access_token: accessToken,
            access_token_expiry: accessExpiresAt,
            refresh_token: refreshToken,
            refresh_token_expiry: refreshExpiresAt
        });
    }
    catch (err){
        throwError("db error" , 500);
    }
    finally {
        clearCookies(res, 'pending_registration' , 'state');
        res.redirect('/login');
    }
}


export default binding;