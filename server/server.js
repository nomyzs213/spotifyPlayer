
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import express from "express";
import cors from "cors";
import { user, user_token } from "./models/table_relations.js";
import { startDb } from "./config/database.js";
import binding from "./routing/accountBinding.js";
import session from "express-session";
import {isHttps} from "./config/cookieInfo.js";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
const app = express();

export const clientPath = path.resolve(__dirname, "../client/views");

const sessionStore = connectPgSimple(session);
const pgPool = new pg.Pool({
    conObject: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: "postgres",
        host: "localhost",
        port: 5432
    }
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

await startDb();




app.use(binding);

app.all(/(.*)/, (req, res) => {
    res.sendFile(path.join(clientPath, "errors/404.html"));
});

app.use((err , req ,res , next) => {
    console.error(err.stack);

    const errorStatus = err.status || 500;

    if(errorStatus === 401){
        return res.status(errorStatus).sendFile(path.join(clientPath, "errors/401.html"));
    }

    if(errorStatus === 403){
        return res.status(errorStatus).sendFile(path.join(clientPath, "errors/403.html"));
    }

    if(errorStatus === 404){
        return res.status(errorStatus).sendFile(path.join(clientPath, "errors/404.html"));
    }

    if(errorStatus === 409){
        return res.status(errorStatus).sendFile(path.join(clientPath, "errors/409.html"));
    }

    if(errorStatus === 500){
        return res.status(errorStatus).sendFile(path.join(clientPath, "errors/500.html"));
    }

    return res.status(500).sendFile(path.join(clientPath, "errors/500.html"));


})

app.listen(process.env.PORT , () => {
    console.log(`server started on port ${process.env.PORT}`);
})