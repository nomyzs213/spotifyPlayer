import express from "express";
import {createError, throwError} from "../utlils/errorManager";
import {email_token} from "../models/table_relations";

const passwordActions = express.Router();

class Tries{
    async increase(resetSecret) {
        try {
            const foundToken = await email_token.findOne({
                where: {
                    reset_secret: resetSecret
                }
            })

            if(!foundToken) throwError("invalid reset secret", 401);

            await foundToken.increment('tries' , {by: 1});

            return foundToken.tries + 1;
        } catch (err) {
            if(err.status) throw err;
            throwError("problem with db", 500);
        }
    }

    async get(resetSecret){
        const found  = await email_token.findOne({
            where: {
                reset_secret: resetSecret
            }
        });

        if(!found) throwError("invalid reset secret", 401);

        return found.tries;
    }

    async reset(resetSecret){
        try{
            await email_token.update({
                tries: 0
            }, {
                where: {reset_secret: resetSecret}
            })
        }
        catch (err){
            throwError("problem with db", 500);
        }
    }
}

const tries = new Tries();


passwordActions.post('/api/password-reset/code' , async (req, res, next) => {
    if(!req.cookies.resetSecret) return next(createError("unauthorized access" , 401));

    const resetSecret = req.cookies.resetSecret;

    if(await tries.get(resetSecret) >= 5) {
        try{
            await email_token.destroy({
                where: {reset_secret: resetSecret}
            })
            res.clearCookie('resetSecret');
            return next(createError("reset token tries amount exceeded the limit", 429));
        }
        catch (err){
            return next(createError("problem with db" , 500));
        }


    }

    const resetToken = req.body.resetToken;
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
        await tries.increase(resetSecret);
        if(await tries.get(resetSecret) >= 5) {
            await tries.reset(resetSecret);
            return next(createError("reset token tries amount exceeded the limit", 429));
        }
        return next(createError(`reset token invalid left tries: ${5 - tries}`));
    }
})


function isCodeValid6NumberString(code) {
    if (typeof code !== "string") return false;

    const trimmed = code.trim();
    const regexp = /^[0-9]{6}$/;

    return regexp.test(trimmed);

}

