import {throwError} from "../../utlils/errorManager";
import {spotifyFetchSchema} from "../../utlils/spotifyFetchSchema";
import {sessionActions} from "../../utlils/session_actions";
import areCodesExpired from "../../utlils/areCodesExpired";
import refreshing from "../refreshCodes.js";

    class generatePlaylist{
        async #getUserPlaylists(req , res){
            if(!req.session.user) throwError("unauthorized access" ,401);

            const accessToken = req.session.user.accessToken;
            const limit = "50";
            const offset = "0";

            await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

            const response = await fetch(
                "https://api.spotify.com/v1/me/playlists"
                + "?offset=" + offset
                + "&limit=" + limit,
                {
                    method: "GET",
                    headers: {
                        Authorization: spotifyFetchSchema.basicHeader(accessToken)
                    }
                }
            );

            if(!response.ok) throwError(response.statusText, response.status);

            const data = await response.json();
            const playlists = data.items;
            const compressedPlaylists = [];

            playlists.forEach(el => {
                compressedPlaylists.push({
                    image: el?.images[0],
                    name: el.name,
                    nextReqUrl: el.items.href
                })
            });

            sessionActions.createPlaylistsInstance(compressedPlaylists);
            return compressedPlaylists;
        }

        async #getTracksDetails(req, res) {
            if (!req.session.user) throwError("unauthorized access", 401);
            if (req.body.reqUrl) throwError("something went wrong with choosing playlist", 500);


            const allItems = [];
            const reqUrl = req.body.reqUrl;
            const accessToken = req.session.user.accessToken;
            const max = "?limit=50";
            const filter = "&fields=items(track(name ,artists(name) ) ),next";

            await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

            const response = await fetch(reqUrl + max + filter, {
                method: "GET",
                headers: {
                    Authorization: spotifyFetchSchema.basicHeader(accessToken)
                }
            });

            if (!response.ok) throwError(response.statusText, response.status);

            const data = await response.json();
            let next = data.next;
            allItems.push(data.items);

            while(next){
                await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

                const response = await fetch(next + filter , {
                    method:  "GET",
                    headers: {
                        authorization: spotifyFetchSchema.basicHeader(accessToken)
                    }
                });
                if(!response.ok) throwError(response.statusText, response.status);
                const data = await response.json();
                allItems.push(data.items);
                next = data.next;
            }


            return allItems;
        }

        // tu bedzie robione na zewnetrznym api oprocz spotify XD
        // spotify sie wywalilo i do nowych aplikacji juz nie daja statow swoich wiec no idealnie

        async getSongsMoodDetails(req, res){
            if(!req.session.user) throwError("unauthorized access", 401);
            const accessToken = req.session.user.accessToken;

        }

    }

