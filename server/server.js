
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import express from "express";
import cors from "cors";
import { user, user_token } from "./models/table_relations.js";
import router from "./routing/accountBinding.js";
import { startDb } from "./config/database.js";

const app = express();

export const clientPath = path.resolve(__dirname, "../client/views");


app.use(cors());
app.use(express.json());

await startDb();

app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

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

    if(errorStatus === 500){
        return res.status(errorStatus).sendFile(path.join(clientPath, "errors/500.html"));
    }

    return res.status(500).sendFile(path.join(clientPath, "errors/500.html"));


})

app.listen(process.env.PORT , () => {
    console.log(`server started on port ${process.env.PORT}`);
})