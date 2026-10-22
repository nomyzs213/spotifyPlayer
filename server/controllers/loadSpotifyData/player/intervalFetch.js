import {throwError} from "../../../utlils/errorManager.js";
import refreshing from "../../refreshCodes.js";
import areCodesExpired from "../../../utlils/areCodesExpired.js";
import {spotifyFetchSchema} from "../../../utlils/spotifyFetchSchema.js";
import controls from "./controls.js";


class IntervalFetch{

    async  getPlaybackState(req , res){
        if(!req.session.user) throwError("unauthorized access" , 401);


        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

        const response = await fetch("https://api.spotify.com/v1/me/player", {
            method: "GET",
            headers: {
                "Authorization": spotifyFetchSchema.basicHeader(accessToken)
            }
        });

        const data = await response.json();
        const {repeat_state , shuffle_state , progress_ms , is_playing , item, is_playable} = data || {};
        if(!repeat_state)   throwError(data.message, data.status);

        const artists = item?.artists;
        const name = item?.name;

        const isTrack = typeof artists != null;

        return res.status(200).json({
            repeat_state,
            shuffle_state,
            progress_ms,
            is_playing,
            is_playable,
            artists,
            name
        });
    }

    async  getCurrentlyPlayingTrack(req , res){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const userId = req.session.user.id;
        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing" ,{
            method: "GET",
            headers: {
                "Authorization": spotifyFetchSchema.basicHeader(accessToken)
            }
        });

        const data = await response.json();
        if(data.message) throwError(data.message, data.status);

        const {is_playing , item , timestamp , progress_ms} = data;

        return res.status(200).json({
            is_playing,
            item,
            timestamp,
            progress_ms
        })
    }

    async  #tracksAreTheSame(old, current) {
        return old == current;
    }

    async loadNewTrack(req, res , {oldTrack, currentTrack}){
        if(await this.#tracksAreTheSame( oldTrack , currentTrack)) {
                const updateTimeline = Math.abs(oldTrack.progress_ms - currentTrack.progress_ms) > 3000;
                if(updateTimeline) await controls.startOrResume(req, res, currentTrack.progress_ms + 400);
        }
        else{
            await this.getCurrentlyPlayingTrack(req, res);
        }
    }


}



export default IntervalFetch;
