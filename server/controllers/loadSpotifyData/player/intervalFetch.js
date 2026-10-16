import {throwError} from "../../../utlils/errorManager";
import refreshing from "../../refreshCodes";
import areCodesExpired from "../../../utlils/areCodesExpired";
import {spotifyFetchSchema} from "../../../utlils/spotifyFetchSchema";

    async function getPlaybackState(req , res){
        if(!req.session.user) throwError("unauthorized access" , 401);

        const accessToken = req.session.user.accessToken;
        await refreshing.refreshTokens(req , res , areCodesExpired());

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

export default getPlaybackState;
