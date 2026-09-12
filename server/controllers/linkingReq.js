import {isHttps} from "../config/cookieInfo.js";
export async function sendLinkingReq(req , res, alreadyRegistered = false) {
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

    const params = new URLSearchParams({
        response_type: 'code',
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        scope: scopes,
        state: state
    }).toString();

    if(alreadyRegistered) {
        res.cookie("already_registered" , true , {httpOnly: true, secure: isHttps, maxAge: 1800 * 1000});
    }
    else{
        res.cookie('state', state, {httpOnly: true, secure: isHttps, maxAge: 1000 * 60 * 60 * 24 * 7});
        res.cookie("already_registered", false , {httpOnly: true ,secure: isHttps , maxAge: 1800 * 1000});
    }

    res.redirect('https://accounts.spotify.com/authorize?' + params);

}
