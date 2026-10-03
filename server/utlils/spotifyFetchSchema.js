export const spotifyFetchSchema = {
    basicHeader: function (accessToken){
        return 'Bearer ' + accessToken
    },
}