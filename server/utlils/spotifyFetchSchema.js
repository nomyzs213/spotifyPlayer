export const spotifyFetchSchema = {
    basicHeader: function (accessToken){
        return {
            Authorization: 'Bearer ' + accessToken
        }
    },
}