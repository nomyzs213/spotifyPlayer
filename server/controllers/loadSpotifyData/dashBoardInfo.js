import {throwError} from "../../utlils/errorManager.js";

class dashboard{
    async #getUserProfile(accessToken){
        const url = "https://api.spotify.com/v1/me";
        const headers = {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }
        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        if(!response.ok) throwError("problem with spotify api" , 500);

        const data = response.json();

        const {account_id, display_name, images} = data;

        return [account_id, display_name, images];
    }

    async #getTopArtists(accessToken){

    }
}


