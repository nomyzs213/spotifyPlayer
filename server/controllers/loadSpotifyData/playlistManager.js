import {throwError} from "../../utlils/errorManager";
import {spotifyFetchSchema} from "../../utlils/spotifyFetchSchema";
import {sessionActions} from "../../utlils/session_actions";
import areCodesExpired from "../../utlils/areCodesExpired";
import refreshing from "../refreshCodes.js";
import {fetched_songs} from "../../models/fetched_songs";
import gemini from "../../utlils/geminiAI";

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
                        Authorization: spotifyFetchSchema.basicHeader(accessToken)
                    }
                }
            );

            if(!response.ok) throwError(response.statusText, response.status);

            const data = await response.json();
            if(!data.items) throwError(data.message, data.status);
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
            const filter = "&fields=items(track(name ,artists(name) , uri) ),next";

            await refreshing.refreshTokens(req , res , areCodesExpired(req.session.user.id));

            const response = await fetch(reqUrl + max + filter, {
                method: "GET",
                headers: {
                    Authorization: spotifyFetchSchema.basicHeader(accessToken)
                }
            });

            if (!response.ok) throwError(response.statusText, response.status);

            const data = await response.json();
            if(!data.next) throwError(data.message, data.status);
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
                if(!data.items) throwError(data.message, data.status);

                allItems.push(...data.items);
                next = data.next;
            }


            return allItems;
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
                    if(!data.toptags) throwError(data.message, data.status);
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
                setTimeout(() => {} , 200);
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
                    Authorization: spotifyFetchSchema.basicHeader(accessToken),
                    'Content-Type': spotifyFetchSchema.jsonHeader()
                },
                body: JSON.stringify({
                    name: req.body.name,
                    public: req.body.public,
                    description: ""
                })
            });

            if(!response.ok) throwError(response.statusText, response.status);
            const data = await response.json();
            if(!data.id) throwError(data.message, data.status);
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
                        Authorization: spotifyFetchSchema.basicHeader(accessToken),
                        'Content-Type' : spotifyFetchSchema.jsonHeader()
                    },
                    body: JSON.stringify({
                        uris: slicedUris,
                        position: positionNumber
                    })
                });

                if(!response.ok) throwError(response.statusText, response.status);
                positionNumber+=100;
            }

            return uris.length;
        }


        async proceed(req, res){
            const allSongs = await this.#getTracksDetails(req, res);
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


