import {spotifyFetchSchema} from "../../../utlils/spotifyFetchSchema.js";
import {throwError} from "../../../utlils/errorManager.js";
import refreshing from "../../refreshCodes.js";
import areCodesExpired from "../../../utlils/areCodesExpired.js";

class Controls{
    async startOrResume(req, res , ms = 0){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req, res, areCodesExpired(req.session.user.id));

        const response = await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                "Authorization" : spotifyFetchSchema.basicHeader(accessToken),
                "Content-Type": spotifyFetchSchema.jsonHeader()
            },
            body: JSON.stringify({
                position_ms: ms
            })
        });

        if(response.status === 204){
            return res.status(response.status).json({actionValid: true});
        }
        const error = await response.json();
        throwError(error.message ,error.status);

    }

    async stop(req , res){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req, res, areCodesExpired(req.session.user.id));

        const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
            method: "PUT",
            headers: {
                "Authorization" : spotifyFetchSchema.basicHeader(accessToken)
            }
        });

        if(response.status === 204){
            return res.status(response.status).json({actionValid: true});
        }
        const error = await response.json();
        throwError(error.message ,error.status);
    }

    async skipToNext(req, res){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req, res, areCodesExpired(req.session.user.id));

        const response = await fetch("https://api.spotify.com/v1/me/player/next" , {
            method: "POST",
            headers: {
                "Authorization" : spotifyFetchSchema.basicHeader(accessToken)
            }
        });

        if(response.status === 204){
            return res.status(response.status).json({actionValid: true});
        }
        const error = await response.json();
        throwError(error.message ,error.status);
    }

    async skipToPrevious(req , res){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req, res, areCodesExpired(req.session.user.id));

        const response = await fetch("https://api.spotify.com/v1/me/player/previous" , {
            method: "POST",
            headers: {
                "Authorization" : spotifyFetchSchema.basicHeader(accessToken)
            }
        });

        if(response.status === 204){
            return res.status(response.status).json({actionValid: true});
        }
        const error = await response.json();
        throwError(error.message ,error.status);
    }

    async seekToPosition(req ,res ,seekMs){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req, res, areCodesExpired(req.session.user.id));

        const response =await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seekMs}`, {
            method: "PUT",
            headers: {
                "Authorization" : spotifyFetchSchema.basicHeader(accessToken)
            }
        });

        if(response.status === 204){
            return res.status(response.status).json({actionValid: true});
        }

        const error = await response.json();
        throwError(error.message ,error.status);

    }

    async setRepeatMode(req , res , repeatMode){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req, res, areCodesExpired(req.session.user.id));

        const response = await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${repeatMode}`, {
            method: "PUT",
            headers:{
                "Authorization" : spotifyFetchSchema.basicHeader(accessToken),
                "Content-Type": spotifyFetchSchema.jsonHeader()
            }
        });

        if(response.status === 204){
            return res.status(response.status).json({actionValid: true});
        }

        const error = await response.json();
        throwError(error.message ,error.status);

    }

    async setPlaybackVolume(req , res , volume){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req, res, areCodesExpired(req.session.user.id));

        const response = await fetch("https://api.spotify.com/v1/me/player/volume", {
            method: "PUT",
            headers: {
                "Authorization" : spotifyFetchSchema.basicHeader(accessToken),
                "Content-Type": spotifyFetchSchema.jsonHeader()
            },
            body: JSON.stringify({
                volume_percent: volume
            })
        })

        if(response.status === 204){
            return res.status(response.status).json({actionValid: true});
        }

        const error = await response.json();
        throwError(error.message ,error.status);
    }

    async togglePlaybackShuffle(req, res, shuffle){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req, res, areCodesExpired(req.session.user.id));

        const response = await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${shuffle}`, {
            method: "PUT",
            headers: {
                "Authorization" : spotifyFetchSchema.basicHeader(accessToken)
            }
        });

        if(response.status === 204){
            return res.status(response.status).json({actionValid: true});
        }

    }

}

