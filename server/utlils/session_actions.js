import {user_token} from "../models/table_relations.js";

export const sessionActions =  {
    createUserInstance: function (req, userId, accessToken, refreshToken){
        if(!userId || !accessToken || !refreshToken) throw new Error("no user information");

        try{
            req.session.user = {
                id: userId,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        }
        catch (err){
            throw err;
        }
    },

    createPlaylistsInstance: function (req, playlists){
        req.session.playlists = playlists;
    },

    updateTokens: async function(req){

        if(!req?.session?.user) return false;

        const found = await user_token.findOne({
            where: {
                user_id : req.session.user.id
            }
        });

        if(!found) return false;

        req.session.user.accessToken = found.access_token;
        req.session.user.refreshToken = found.refresh_token;

        return true;
    },

    updateId: function (req, id){
        if(!req?.session.user || !id) return;
        req.session.user.id = id;
    }

};