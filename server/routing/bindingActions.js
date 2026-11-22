import express from "express";


const binding = express.Router();
import {user , user_token}  from "../models/table_relations.js";
import {clearCookies} from "../utlils/cookieClearing.js";
import {getAccessTokenWithCode} from "../controllers/token_manager.js";
import {sequelize} from "../config/database.js";

import {throwError, createError} from "../utlils/errorManager.js";
import {checkForCodesRefresh} from "../middleware/token_expiration.js";
import {sessionActions} from "../utlils/session_actions.js";


binding.get('/api/binding' , async (req , res , next) => {
    const {error , status} = req.query;


    if(status === "canceled"){
        clearCookies(res , "pending_registration" , "state");
        return res.status(400).json({redirectError: true, error: {status: 400 , message: "registration canceled"}});
    }

    if(error) {
        clearCookies(res , "pending_registration" , "state");
        return res.status(400).json({redirectError: true, error: {status: 502 , message: "problem with Spotify api"}});
    }

    if(!req.query.code){
        return res.status(500).json({redirectError: true , error: {code: 500 , message: "problem with Spotify api", query: req.query}});
    }


    const alreadyRegistered = req.cookies.already_registered;

    if(alreadyRegistered === 'true'){
        try{
            await bindExistingAccount(req, res);
            console.log("existing user refresh token is refreshed");
            res.redirect("127.0.0.1:5173/htmls/dashboard.html");
        }
        catch(err){
            return res.status(err.status).json({redirectError: true, error: {status: err.status , message: err.message}});
        }
    }
    else{
        try{
            await bindNewAccount(req , res);
            console.log("new user created")
            res.redirect("127.0.0.1:5173/htmls/dashboard.html")
        }
        catch(err){
            return res.status(err.status).json({redirectError: true, error: {status: err.status , message: err.message}});
        }
    }


})

binding.get("/api/getBindingStatus" , (req , res, next) => {
    try{
        const status = req.cookies.binding_success === "true";
        res.clearCookie("binding_success");
        if(status) return res.status(204);
        throwError("no binding status" , 401);
    }
    catch (err){
        return res.status(err.status).json({message: err.message , status: err.status});
    }
});

async function bindNewAccount(req, res) {
    const code = req.query.code;
    const state = req.query.state;
    const stateInCookies = req.cookies.state;

    console.log(req.cookies);

    if (!state) {
         clearCookies(res, 'pending_registration', 'state');
        throwError("missing params from req.query" , 400);
    }

    if(!stateInCookies || stateInCookies !== state) {
        clearCookies(res, 'pending_registration', 'state');
        throwError("missing cookies" , 400);
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

        sessionActions.createUserInstance(req, createdUser.id, accessToken , refreshToken);

        await t.commit();


    } catch (err) {
        await t.rollback();
        console.log(err);
        throwError("db error" , 500);
    }
    finally {
        clearCookies(res, 'pending_registration' , 'state');
    }

    res.redirect("/htmls/dashboard.html");
}

async function bindExistingAccount(req ,res){
    const {code , state} = req.query;
    const stateInCookies = req.cookies.state;

    if(!state  || !stateInCookies || !code){
        clearCookies(res,'state');
        throwError("missing params from req.query or from cookies" , 400);
    }

    if(state !== stateInCookies){
        clearCookies(res, 'pending_registration' , 'state');
        throwError("states in cookie is not equal to the one in request" , 400);
    }

    await checkForCodesRefresh(req, res);
    const userId = req.cookies.user_id;

    let accessToken ,refreshToken , accessExpiresAt, refreshExpiresAt;

    try{
        [accessToken, refreshToken  , accessExpiresAt , refreshExpiresAt] = await getAccessTokenWithCode(code);
    }
    catch(err){
        clearCookies(res, 'pending_registration' , 'state');
        throwError("missing tokens" , 400);
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
        clearCookies(res, 'state');
    }

    const found = await sessionActions.updateTokens(req);
    if(!found) throwError('problem with session' ,400);


    req.session.regenerate(req);
}


export default binding;