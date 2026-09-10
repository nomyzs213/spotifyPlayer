import {isLocal} from "../config/cookieInfo.js";
export async function sendLinkingReq(req , res, alreadyRegistered) {
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
    res.cookie('state', state, {httpOnly: true, secure: isLocal, maxAge: 1000 * 60 * 60 * 24 * 7});

    const params = new URLSearchParams({
        response_type: 'code',
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        scope: scopes,
        state: state
    }).toString();


    res.redirect('https://accounts.spotify.com/authorize?' + params);

}
