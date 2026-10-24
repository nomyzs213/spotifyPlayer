import {throwError} from "../utlils/errorManager.js";

export default async function proceedLogout(req, res) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            error: true,
            status: 401,
            message: "cannot access logout without session"
        });
    }

    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({
                error: true,
                status: 500,
                message: err.message
            });
        }

        res.clearCookie('connect.sid');
        return res.status(200).json({
            success: true,
            message: "Wylogowano pomyślnie"
        });
    });
}