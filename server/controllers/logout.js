import {createError, throwError} from "../utlils/errorManager.js";

export default async function proceedLogout(req, res){
    if(req.session){
        req.session.destroy(err => {
            if(err) {
                throwError(err.message, 500);
            }
        });
        res.clearCookie('connect.sid');
    }
     throwError("cannot access logout without session", 401);
}