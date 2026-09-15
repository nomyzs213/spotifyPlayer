export function generateSessionToken(res){
    const randomId = crypto.randomUUID();
    res.cookie('session_id' , randomId);
    return randomId;
}