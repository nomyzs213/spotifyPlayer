import {throwError} from "../../utlils/errorManager.js";
import {spotifyFetchSchema} from "../../utlils/spotifyFetchSchema.js";

class dashboard{
    async #getUserProfile(accessToken){
        const url = "https://api.spotify.com/v1/me";

        const response = await fetch(url, {
            method: "GET",
            headers: spotifyFetchSchema.basicHeader(accessToken)
        });

        if(!response.ok) throwError("problem with spotify api" , 500);

        const data = response.json();

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
            const shortTermData = await shortTerm.json();
            const mediumTermData = await mediumTerm.json();
            const longTermData = await longTerm.json();

        }
    }

     #getCompressedTopItems( artists = {} ,tracks = {} ){
        const compressedArtists = [];
        const compressedTracks = [];

        for(let i = 0; Reflect.ownKeys(artists); i++){
            compressedArtists.push(
                {
                    name: artists[i].name,
                    image: artists[i].images?.at(-1)?.url,
                    uri: artists[i].uri
                }
            )
        }

        for(let i =0; Reflect.ownKeys(tracks); i++){
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


}


