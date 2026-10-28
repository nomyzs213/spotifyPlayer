import express from "express";
import path from "node:path";
import {clientPath} from "../server.js";

const redirect = express.Router();

redirect.get("/api/redirect" ,(req , res)=> {
    const path = req.params.path;
    res.status(200).sendFile(path.join(clientPath, `${path ? path : "index"}.html`));
})

export default redirect;