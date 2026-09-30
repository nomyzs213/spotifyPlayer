import {throwError} from "../../utlils/errorManager.js";
import {spotifyFetchSchema} from "../../utlils/spotifyFetchSchema.js";
import refreshing from "../refreshCodes.js";
import areCodesExpired from "../../utlils/areCodesExpired.js";

class dashboard{
    async #getUserProfile( accessToken){
        const url = "https://api.spotify.com/v1/me";
        if(!accessToken) throwError("unauthorized access", 401);

        const response = await fetch(url, {
            method: "GET",
            headers: spotifyFetchSchema.basicHeader(accessToken)
        });

        if(!response.ok) throwError("problem with spotify api" , 500);

        const data = await response.json();

        const {account_id, display_name, images} = data;

        return [account_id, display_name, images];
    }

    async #getTopItems(accessToken , type){
        const url = "https://api.spotify.com/v1/me/top/";
        const timeRanges = ["short_term" , "medium_term" , "long_term"];
        const limit = 5;
        const offset = 0;
        const fetches = new Array(3);

        for(let i = 0; i<= 2; i++) {
            fetches[i] = fetch(
                url
                + type
                + "?time_range=" + timeRanges[i]
                + "&limit=" + limit
                + "&offset=" + offset
            , {
                    headers: spotifyFetchSchema.basicHeader(accessToken)
                })
        }
        const [shortTerm , mediumTerm , longTerm]  = await Promise.all(fetches);

        if(shortTerm.ok && mediumTerm.ok && longTerm.ok){
            const [shortTermData, mediumTermData, longTermData] = await Promise.all([
                shortTerm.json(), 
                mediumTerm.json(),
                longTerm.json()
            ])

            return{
                shortTerm: shortTermData,
                mediumTerm: mediumTermData,
                longTerm: longTermData
            }
        }
        throwError("problem with downloading data" , 500);
    }

     #getCompressedTopItems( req , artists = {} ,tracks = {} ){
        if(!req.session.user) throwError("unauthorized access" , 401);
        const compressedArtists = [];
        const compressedTracks = [];

        for(let i = 0; i< artists.length; i++){
            compressedArtists.push(
                {
                    name: artists[i].name,
                    image: artists[i].images?.at(-1)?.url,
                    uri: artists[i].uri
                }
            )
        }

        for(let i =0; i<tracks.length; i++){
            compressedTracks.push(
                {
                    name: tracks[i].name,
                    isLocal: tracks[i].is_local,
                    album: tracks[i].album,
                    artists: tracks[i].artists,
                 }
            )
        }

        return [compressedArtists , compressedTracks];
    }

    async loadDashBoard(req , res){
        const accessToken = req.session.user.accessToken;
        if(!accessToken) throwError("unauthorized access" ,401);

        await refreshing.refreshTokens(req,res , await areCodesExpired(req.session.user.id));

        const userProfile = await this.#getUserProfile(accessToken);
        const artists = await this.#getTopItems(accessToken, "artists");
        const tracks = await this.#getTopItems(accessToken, "tracks");
        const [compressedArtists , compressedTracks] = this.#getCompressedTopItems(req , artists, tracks);

        return {
            compressedTopItems: {
                artists: compressedArtists,
                tracks: compressedTracks
            },
            userProfile: userProfile
        }
    }

}

const DashboardLoader = new dashboard();
export default DashboardLoader;