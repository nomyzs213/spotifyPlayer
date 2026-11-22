import { isHttps } from "../config/cookieInfo.js";

export function clearCookies(res, ...cookiesNames) {
    for (const name of cookiesNames) {
        res.clearCookie(name, {
            httpOnly: true,
            secure: isHttps,
            sameSite: "lax",
            path: "/"
        });
    }
}