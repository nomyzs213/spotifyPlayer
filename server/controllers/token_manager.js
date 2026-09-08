import {Buffer} from "node:buffer";


export async function getAccessToken(code){
    const url = 'https://accounts.spotify.com/api/token';
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const bodyContent = new URLSearchParams(
        {
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
        }
    ).toString();

    const fetchResponse = await fetch(url , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + ( Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
        body: bodyContent
    })

    if(!fetchResponse.ok) {
        throw new Error('problem with spotify api')
    }

    const data =  await fetchResponse.json();
    const {access_token, expires_in , refresh_token} = data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    return [access_token , refresh_token , expiresAt];

}