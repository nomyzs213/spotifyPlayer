import {throwError} from "../utlils/errorManager.js";
import {user} from "../models/table_relations.js";
import bcrypt from "bcrypt";

export async function changePassword(req , res){
    if(!req.session.user.id) throwError("unauthorized access" , 401);

    const foundUser = await user.findByPk(req.session.user.id);
    if(!foundUser) throwError("user not found" , 404);

    const oldPassword = foundUser.password_hash;
    const passwordCandidate = req.body.newPassword;
    const theSame = await bcrypt.compare(passwordCandidate, oldPassword);

    if(theSame) {
        throwError("new password cannot be the same as the old password" , 400);
    }

    if(passwordCandidate.length < 8) {
        throwError("password must be at least 8 characters long" , 400);
    }
    
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(passwordCandidate, salt);

    try{
        await foundUser.update({password_hash: newPassword});
    }
    catch(err){
        throwError("problem with db" , 500);
    }


}