import express from "express";
import path from "node:path";
import {clientPath} from "../server";
import cookieParser from "cookie-parser";
import {createError, throwError} from "../utlils/errorManager";
import {email_token} from "../models/table_relations";
const passwordActions = express.Router();


passwordActions.post('api/password-reset/code' , async (req, res, next) => {
    let tries;
    if(!req.cookies.resetSecret) return next(createError("unauthorized access" , 401));

    if(tries >= 5) {
        tries = 0;
        throwError("reset token tries amount exceeded the limit", 429);
    }

    const resetToken = req.body.resetToken;
    const resetSecret = req.cookies.resetSecret;
    if(!isCodeValid6NumberString(resetToken)) return next(createError("reset token invalid") , 400);

    let validToken;
    try{
        validToken = await email_token.findOne({
            where: {
                reset_token: resetToken,
                reset_secret: resetSecret
            }
        })
    }
    catch (err){
        return next(createError("problem with db" ,500));
    }

    if(!validToken) {
        tries = await increaseTries(resetSecret);
        if(tries >= 5) {
            tries = 0;
            throwError("reset token tries amount exceeded the limit", 429);
        }
        return next(createError(`reset token invalid left tries: ${5 - tries}`));
    }
})


function isCodeValid6NumberString(code) {
    if (typeof code !== "string") return false;

    const trimmed = code.trim();
    const regexp = /^[0-9]{6}$/;

    if(!regexp.test(trimmed)) return false;
}

async function increaseTries(resetSecret) {
    try {
       const foundToken = await email_token.findOne({
           where: {
               reset_secret: resetSecret
           }
       })

        if(!foundToken) throwError("invalid session token", 401);

        await foundToken.increment('tries' , {by: 1});

        return foundToken.tries + 1;
    } catch (err) {
        if(err.status) throw err;
        throwError("problem with db", 500);
    }
}

