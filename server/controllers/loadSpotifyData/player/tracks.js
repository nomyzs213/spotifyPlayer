import {throwError} from "../../../utlils/errorManager";
import refreshing from "../../refreshCodes";
import areCodesExpired from "../../../utlils/areCodesExpired";
import {spotifyFetchSchema} from "../../../utlils/spotifyFetchSchema";

class Tracks{
    async getUsersQueue(req , res){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req , res , areCodesExpired());
        const response = await fetch("https://api.spotify.com/v1/me/player/queue", {
            method: "GET",
            headers: {
                "Authorization": spotifyFetchSchema.basicHeader(accessToken)
            }
        });

        const data = await response.json();
        if(data.status) throwError(data.message, data.status);

         const currentlyPlaying = data?.currently_plaing;
         const queue = data?.queue;

         const filteredTracks = queue.map(el => {
             return {
                 name: el.name,
                 artist: el?.artist,
                 cover: el.album?.images[0],
                 episodeCover: el?.images[0]
             }
         });

         return res.status(200).json({
             tracks: filteredTracks
         });

    }

    async getRecentlyPlayedTracks(req , res){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req , res , areCodesExpired());

        const limit = 50;

        const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}` , {
            method: "GET",
            headers: {
                "Authorization": spotifyFetchSchema.basicHeader(accessToken)
            }
        });

        const data = await response.json();
        if(data.message) throwError(data.message, data.status);

        const {items} = data;

        const filteredTracks = items.filter(el => {
            return {
                name: el.track.name,
                artists: el.track.artists,
                cover: el.track.album?.images[0]
            }
        });
    }

}