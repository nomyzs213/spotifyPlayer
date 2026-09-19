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

    updateAccessToken: function (req, token){
        if(!token || !req?.session.user) return;
        req.session.user.accessToken = token;
    },

    updateRefreshToken: function (req ,token){
        if(!token || !req?.session.user) return;
        req.session.user.refreshToken = token;
    },

    updateId: function (req, id){
        if(!req?.session.user || !id) return;
        req.session.user.id = id;
    }

};