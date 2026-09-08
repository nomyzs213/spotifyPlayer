import bcrypt  from "bcrypt";
import dotenv from "dotenv";
import {user} from "../models/user.js";
import {Op} from "sequelize";
dotenv.config();

const isLocal = process.env.NODE_ENV === "production";

export async function sendLinkingReq(req , res){
    const scopes = [
        'user-top-read',
        'user-read-private',
        'playlist-read-collaborative',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-read-email'
    ].join(' ');

    const state = crypto.randomUUID();
    res.cookie('state' , state , {httpOnly: true , secure: isLocal, maxAge: 1000 * 60 * 60 * 24 * 7});

    const params = new URLSearchParams({
        response_type: 'code',
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        scope: scopes,
        state: state
    }).toString();


    res.redirect('https://accounts.spotify.com/authorize?' + params);


}
async function register(req , res){
    let {username , email , password} = req.body.registrationData;
    if(!username || !email || !password) return res.status(400).json("cant register without email or username");

    if(username.toLowerCase() === username && username.length >= 3 && email.length >= 3 && email.toLowerCase() === email && password.length >= 8) {
        username = username.toLowerCase().replace(/\s+/g , "");
        email = email.toLowerCase().replace(/\s+/g , "");
        password = password.replace(/\s+/g , "");

        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const alreadyExists = await user.findOne({
                where: {
                    [Op.or] : [ {username: username} , {email: email}]}
            });

            if(alreadyExists) {
                return res.status(409).json("account with that email already exists");
            }

            const cookie = {username , email , hashedPassword};
            res.cookie('pending_registration' , cookie , {httpOnly: true, secure: isLocal , maxAge: 1000 * 60 * 30});
            await sendLinkingReq(req , res);


        }
        catch (error){
            console.log(error);
            return res.status(500).json("database error");
        }
    }
    else{
        return res.status(400).json("cant register when email or username is invalid");
    }
}
