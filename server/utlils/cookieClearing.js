export function clearCookies(res, ...cookiesNames) {
    for (const name of cookiesNames) {
        res.clearCookie(name);
    }
}