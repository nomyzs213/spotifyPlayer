export const spotifyFetchSchema = {
    basicHeader: function (accessToken){
        return 'Bearer ' + accessToken
    },
    jsonHeader: function (){
        return "Content-Type: application/json"
    }
}