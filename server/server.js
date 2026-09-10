import express  from "express";
import * as path from "node:path";
import cors from "cors";
import { fileURLToPath } from "node:url";
import {user , user_token} from "./models/table_relations.js";
import {startDb} from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const clientPath = path.resolve(__dirname, "../client/views");


app.use(cors());
app.use(express.json());

await startDb();

app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

app.all('/*splat', (req, res) => {
    res.sendFile(path.join(clientPath, "404.html"));
});


app.listen(process.env.PORT , () => {
    console.log(`server started on port ${process.env.PORT}`);
})