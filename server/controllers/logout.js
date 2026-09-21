import {createError} from "../utlils/errorManager.js";

export default async function proceedLogout(req, res, next){
    if(req.session){
        req.session.destroy(err => {
            if(err) {
                next(createError(err.message), 500);
            }
        });
        res.clearCookie('connect.sid');
    }
    return next(createError("cannot access logout without session", 401));
}