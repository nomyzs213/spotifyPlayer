import express from "express";
import {createError, throwError} from "../utlils/errorManager";
import {email_token, user} from "../models/table_relations";
import bcrypt from "bcrypt";
import { sequelize } from "../config/database";
import { changePassword } from "../controllers/password_change";
import path from "node:path";
import { clientPath } from "../server";

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

    return res.redirect('/api/reset-password/form');
})


function isCodeValid6NumberString(code) {
    if (typeof code !== "string") return false;

    const trimmed = code.trim();
    const regexp = /^[0-9]{6}$/;

    return regexp.test(trimmed);

}

passwordActions.post('/api/password-reset/form' , async(req , res, next) => {
    if(!req.cookies.resetSecret) return next(createError("unauthorized access" , 401));

    const {passwordInForm, confirmPassword} = req.body;

    if(!passwordInForm || !confirmPassword) return next(createError("cant complete without password and its confirmation "));
    if(passwordInForm !== confirmPassword) return next(createError("password and its confirmation are not the same" , 400));
    if(passwordInForm.length< 8) return next(createError("password is too short min : 8 characters", 400) );
    
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordInForm = await bcrypt.hash(passwordInForm, salt);

    const t = await sequelize.transaction();
    try{
        const foundToken = await email_token.findOne({
            where: {
                reset_secret: resetSecret
            }
        } , {transaction: t});

        if(!foundToken) return next(createError("couldnt find valid reset token" , 401));

        await user.update({
            password_hash: hashedPasswordInForm
        }, 
        {transaction: t , where: {id: foundToken.user_id}});

       await t.commit()
    } 
    catch(err){
        await t.rollback();
       return next(createError("problem with db" , 500));

    }

    return res.redirect("/api/password-reset/completed");
});

passwordActions.post('/api/password-change' , async (req, res, next) => {
    try{
        await changePassword(req);
        res.status(200).json({message: "password changed succesfully"});
    }
    catch(err){
        return next(createError(err.message, err.status));
    }
});

passwordActions.post('/api/password-reset/completed', async(req, res,  next) => {
    if(!req.cookies.resetSecret) return next(createError("unauthorized access" , 401)); // dodatkowe sprawdznie , moze i nawet nie potrzebne ale kogo to obchodzi
    res.clearCookie('resetSecret');
    res.sendFile(path.join(clientPath, "password-actions/completed.html")); // przeniesienie na htmla ktory po okreslonym czasie wysyla na /login
})
