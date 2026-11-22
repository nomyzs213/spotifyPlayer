import areCodesExpired from "../utlils/areCodesExpired.js";
import refreshing from "../controllers/refreshCodes.js";

export async function checkForCodesRefresh(req , res) { // dla podfunkcji ktore robia throw err
        await refreshing.refreshTokens(req, res, await areCodesExpired(req?.session?.user?.id));
}
