import {throwError} from "../../utlils/errorManager.js";
import {spotifyFetchSchema} from "../../utlils/spotifyFetchSchema.js";
import {sessionActions} from "../../utlils/session_actions.js";
import areCodesExpired from "../../utlils/areCodesExpired.js";
import refreshing from "../refreshCodes.js";
import {fetched_songs} from "../../models/fetched_songs.js";
import gemini from "../../utlils/geminiAI.js";
import {setTimeout} from "timers/promises";
import session from "express-session";

    class playlistsManager{
        constructor() {
            this.MOOD_MAPPING = {
                energetic: ['workout', 'banger', 'party', 'energetic', 'rock', 'fast'],
                chill: ['chill', 'relax', 'lo-fi', 'ambient', 'calm', 'sleep'],
                sad: ['sad', 'melancholy', 'heartbreak', 'depressing', 'cry'],
                happy: ['happy', 'fun', 'upbeat', 'summer', 'feel good']
            };
        }

        #matchesMood(req, tagsList){
            if(!req.body.mood) throwError("no mood found", 401);
            let searchedMood;
            switch (req.body.mood){
                case 'energetic':
                    searchedMood = this.MOOD_MAPPING.energetic;
                    break;
                case 'chill':
                    searchedMood = this.MOOD_MAPPING.chill;
                    break;
                    case 'sad':
                        searchedMood = this.MOOD_MAPPING.sad;
                        break;
                        case 'happy':
                            searchedMood = this.MOOD_MAPPING.happy
                            break;
                default: throwError("no mood found", 403);
            }

            const tagsAmount = tagsList.length;
            if( tagsAmount  ===  0) return null;
            let moodCount = 0;
            tagsList.forEach(tag => {
                if(searchedMood.includes(tag.name)) moodCount++;
            });

            return moodCount > Math.floor(tagsAmount / 2);
        }

        async getUserPlaylists(req , res){
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
                        "Authorization": spotifyFetchSchema.basicHeader(accessToken),
                        "Content-Type": spotifyFetchSchema.jsonHeader()
                    }
                }
            );

            if(!response.ok) {
                const data = await response.json();
                throwError(data.error.message, data.error.status);
            }

            const data = await response.json();
            if(!data.items) throwError(data.error.message, data.error.status);
            const playlists = data.items;
            const compressedPlaylists = [];

            playlists.forEach(el => {
                compressedPlaylists.push({
                    id: el.items.id,
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
            if (req.body.id) throwError("something went wrong with choosing playlist", 500);


            const allItems = [];
            const reqUrl = req.body.id;
            const accessToken = req.session.user.accessToken;
            const max = "?limit=50";
            const filter = "&fields=items(track(name ,artists(name) , uri) ),next";

            await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

            const response = await fetch(reqUrl + max + filter, {
                method: "GET",
                headers: {
                    "Authorization": spotifyFetchSchema.basicHeader(accessToken),
                    "Content-Type": "application/json"
                }
            });

            if(!response.ok) {
                const data = await response.json();
                throwError(data.error.message, data.error.status);
            }

            const data = await response.json();
            if(data.error) throwError(data.error.status, data.error.message);
            let next = data.next;
            allItems.push(data.items);

            while(next){
                await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

                const response = await fetch(next + filter , {
                    method:  "GET",
                    headers: {
                        "Authorization": spotifyFetchSchema.basicHeader(accessToken),
                        "Content-Type": spotifyFetchSchema.jsonHeader()
                    }
                });
                if(!response.ok) {
                    const data = await response.json();
                    throwError(data.error.message, data.error.status);
                }
                const data = await response.json();
                if(!data.items) throwError(data.error.message, data.error.status);

                allItems.push(...data.items);
                next = data.next;

                await setTimeout(200);
            }


            return allItems;
        }

        async #getLikedSongs(req, res){
            if(!req.body.likedSongs) throwError("unauthorized liked songs get", 401);
            if (!req.session.user) throwError("unauthorized access - no session", 401);
            if (req.body.id) throwError("something went wrong with choosing playlist", 500);


            const max = "?limit=50";
            const accessToken = req.session.user.accessToken ;
            const allSongs = [];

            await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

            const response = await fetch("https://api.spotify.com/v1/me/tracks"+ max , {
                method: "GET",
                headers: {
                    "Content-Type": spotifyFetchSchema.jsonHeader(),
                    "Authorization": spotifyFetchSchema.basicHeader(accessToken)
                }
            });

            if(!response.ok) {
                const data = await response.json();
                throwError(data.error.message, data.error.status);
            }

            const data = await response.json();
            let next = data.next;
            while (next){
                await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

                const response = await fetch(next, {
                    "method": "GET",
                    headers: {
                        'Authorization': spotifyFetchSchema.basicHeader(accessToken),
                        "Content-Type": spotifyFetchSchema.jsonHeader()
                    }
                });

                if(!response.ok){
                    const data = await response.json();
                    throwError(data.error.message, data.error.status);
                }

                const data = await response.json();

                next = data.next;
                allSongs.push(...data.items);
                await setTimeout(200);

            }
            return allSongs;
        }
        async hasLikedSongs(req, res){
            if(!req.session.user) throwError("unauthorized access", 401);
            const limit = "?limit=1";
            const accessToken = req.session.user.accessToken;

            await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

            const response = await fetch("https://api.spotify.com/v1/me/tracks" + limit, {
                method: "GET",
                headers: {
                    "Authorization": spotifyFetchSchema.basicHeader(accessToken),
                    "Content-Type" : spotifyFetchSchema.jsonHeader()
                }
            });

            if(!response.ok){
                const data = await response.json();
                throwError(data.error.message, data.error.status);
            }
            const data = await response.json();
            return data.total >0;

        }
        // tu bedzie robione na zewnetrznym api oprocz spotify XD
        // spotify sie wywalilo i do nowych aplikacji juz nie daja statow swoich wiec no idealnie

        async #getSongsMoodTags(req, res, allSongs){
            if(!req.session.user) throwError("unauthorized access", 401);

            const matchingSongs = [];

            for(const item of allSongs){
                const artist = item.track.artists[0];
                const songName = item.track.name;

                let found;
                try{
                     found = await fetched_songs.findOne({
                        where: {
                            artist: artist,
                            name: songName
                        }
                    });
                }
                catch (err){
                    throwError("problem with db" , 500);
                }

                let tagNames = [];
                if(found){
                    tagNames = [...found.tags];
                }
                else{
                    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${process.env.LAST_FM_API_KEY}&artist=${artist}&track=${songName}&format=json`);
                    if(!response.ok) throwError("problem with last.fm" , 500);

                    const data = await response.json();
                    if(!data.toptags) throwError(data.error.message, data.error.status);
                    const rawTags = data.track.toptags.tag || [];
                    // z last fm moze byc pusta tablica wiec dla niszowych piosenek szukamy prze ai

                    if(rawTags === []) {
                        tagNames = await gemini.evaluateTrackTags(artist , songName);
                    }
                    else{
                        tagNames = rawTags.map(t => t.toLowerCase());
                    }

                    try{
                        await fetched_songs.create({
                            name: songName,
                            artist: artist,
                            tags: tagNames
                        })
                    }
                    catch (err){
                        throwError("problem with db" , 500);
                    }

                }
                if(this.#matchesMood(req, tagNames)) matchingSongs.push(item.track);
                await setTimeout(200);
                // max 5 req na sek czytajac z ich docsow
            }

            if(matchingSongs.length > 0) return matchingSongs;
            return null;
        }

        async #createPlaylist(req , res){
            if(!req.session.user) throwError("unauthorized access", 401);

            await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));
            const accessToken = req.session.user.accessToken;

            const response = await fetch("https://api.spotify.com/v1/me/playlists" , {
                method: "POST",
                headers: {
                    'Authorization': spotifyFetchSchema.basicHeader(accessToken),
                    'Content-Type': spotifyFetchSchema.jsonHeader()
                },
                body: JSON.stringify({
                    name: req.body.name,
                    public: req.body.public,
                    description: ""
                })
            });

            if(!response.ok) {
                const data = await response.json();
                throwError(data.error.message, data.error.status);
            }
            const data = await response.json();
            if(!data.id) throwError(data.error.message, data.error.status);
            return data.id;
        }

        async #fillPlaylist(req, res , playlistId, matchingSongs){
            if(!req.session.user) throwError("unauthorized access", 401);

            await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));
            const accessToken = req.session.user.accessToken;
            let positionNumber = 0;

            const uris = matchingSongs.map(song => song.uri).slice(0, 500);

            while(positionNumber <= uris.length){
                const slicedUris = uris.slice(positionNumber , positionNumber + 100 + 1) || null;
                if(!slicedUris) break;

                const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    method: "POST",
                    headers: {
                        'Authorization': spotifyFetchSchema.basicHeader(accessToken),
                        'Content-Type' : spotifyFetchSchema.jsonHeader()
                    },
                    body: JSON.stringify({
                        uris: slicedUris,
                        position: positionNumber
                    })
                });

                if(!response.ok) {
                    const data = await response.json();
                    throwError(data.error.message, data.error.status);
                }
                positionNumber+=100;
            }

            return uris.length;
        }


        async proceed(req, res){
            let allSongs;
            if(req.body.likedSongs)  allSongs = await this.#getLikedSongs(req,res);
            else  allSongs = await this.#getTracksDetails(req, res);
            const matchingSongs = await this.#getSongsMoodTags(req, res, allSongs);

            if(!matchingSongs) res.status(200).json({
                success: true,
                message: "couldnt find any songs that match selected mood"
            });

            const playlistId = await this.#createPlaylist(req, res);
            const songsCount = await this.#fillPlaylist(req, res, playlistId, matchingSongs);
            res.status(200).json({
                success: true,
                message: "created playlist with songs of selected moood",
                count: songsCount
            })
        }
    }

    const playlistManager = new playlistsManager();
    export default playlistManager;


