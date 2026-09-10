export async function clearCookies(res , cookiesNames){
    for(name in cookiesNames){
        await res.clearCookie(`${name}`);
    }
}