
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import express from "express";
import cors from "cors";

import { user, user_token } from "./models/table_relations.js";
import { startDb } from "./config/database.js";

// wszystkie routery
import binding from "./routing/accountBinding.js";
import proceedLogout from "./controllers/logout.js";
import dashboardHandler from "./routing/dashboard.js";
import passwordActions from "./routing/passwordActions.js";
import loadPlaylists from "./routing/playlists.js";
import proceedLogin from "./routing/processLogin.js";
import proceedRegistration from "./routing/processRegistration.js";
import playlistGenerator from "./routing/generatePlaylists.js";

import session from "express-session";
import {isHttps} from "./config/cookieInfo.js";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
const app = express();

export const clientPath = path.resolve(__dirname, "../client/frontend/htmls");



const sessionStore = connectPgSimple(session);
const pgPool = new pg.Pool({
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: "localhost",
        port: 5432
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new sessionStore({
       pool: pgPool,
       tableName: "user_sessions",
        createTableIfMissing: true
    }),
    genid: function (){
        return crypto.randomUUID();
    },
    cookie: {
        httpOnly: true,
        secure: isHttps,
        maxAge: 3600 * 24 * 7 * 1000,
        sameSite: 'lax'
    }
}))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

await startDb();

// wszystkie routery

app.use(binding);
app.use(proceedLogout);
app.use(dashboardHandler);
app.use(passwordActions);
app.use(loadPlaylists);
app.use(proceedLogin);
app.use(proceedRegistration);
app.use(playlistGenerator);

app.all(/(.*)/, (req, res) => {
    res.sendFile(path.join(clientPath, "errors/404.html"));
});

app.use((err , req ,res , next) => {
    console.error(err.stack);

    const errorStatus = err.status || 500;

    if (req.originalUrl.startsWith('/api/')) {
        return res.status(errorStatus).json({
            error: true,
            status: errorStatus,
            message: err.message || "Wystąpił błąd serwera"
        });
    }


    res.status(errorStatus).sendFile(path.join(clientPath, `errors/${errorStatus}.html`));

})


app.listen(process.env.PORT, '127.0.0.1', () => {
    console.log(`Server started on http://127.0.0.1:${process.env.PORT}`);
});