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
    }
};