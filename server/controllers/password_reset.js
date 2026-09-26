import transporter from "../utlils/mailerInstance.js";
import {user, email_token} from "../models/table_relations.js";
import {throwError} from "../utlils/errorManager";
import {isHttps} from "../config/cookieInfo";

async function sendResetCode(req, res){


    const foundUser = await user.findOne({
            where: {
                email: req.body.email
            }
    })

    if(!foundUser) throwError("couldn't find user" , 500);

    const email = foundUser.email;
    const userId = foundUser.id;
    const tokenExpiry = new Date(Date.now() + 900 * 1000);
    const token = crypto.randomInt(100000 , 1000000).toString();
    const resetSecret = crypto.randomBytes(32).toString();

    // token : 100 000 - 999 999 wpisywane do inputa
    // resetSecret - daje serverowi kod ktory jest przekazywany pomiedzy kolejnymi etapami logowania
    // aby sprawdic ze to na 100% jest ten sam uzytkownik wszysstkie zadania ida przez posta i cookie http only
    try{
        const tokenInstance = email_token.create({
            user_id: userId,
            token: token,
            token_expiry: tokenExpiry,
            reset_secret: resetSecret
        })
    }
    catch (err){
        throwError("problem with db" , 500);
    }

    try {
        await sendMail(email , token);
    }
    catch (err){
        throwError("problem with sending mail", 500);
    }

    req.cookie('resetSecret' , resetSecret , { httpOnly: true, secure: isHttps, maxAge: 1000 * 900 });
    req.cookie('userEmail' , email , { httpOnly: true, secure: isHttps, maxAge: 1000 * 900 });
    // expiry takie same co reset token by sie nie rozwalilo po drodze

    res.redirect("/password-reset/code");
}

async function sendMail(userEmail , token) {
    const info = await transporter.sendMail({
        from: `Spotify-app bot <${process.env.EMAIL_FROM}>`,
        to: userEmail,
        subject: "Password reset",
        html: `
        <h1> We received your request to reset your password</h1>
        <p>your code to reset your password: </p>
        <h2>${token}</h2>
        `
    });
}




