import express from "express";
import path from "node:path";
import {clientPath} from "../server";
import cookieParser from "cookie-parser";
import {createError} from "../utlils/errorManager";

const basicRoutes = express.Router();

basicRoutes.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

basicRoutes.get('/login', (req, res) => {
    res.sendFile(path.join(clientPath, "login.html"));
});

basicRoutes.get('/password-reset/code', (req, res, next) => {
    if(!req.cookies.resetSecret) return next(createError("unauthorized access", 401));
    res.sendFile(path.join(clientPath, "passwordReset/code.html"));
});

basicRoutes.get('/password-reset/form' , (req, res, next) => {
    if(!req.cookies.resetSecret) return next(createError("unauthorized access", 401));
    res.sendFile(path.join(clientPath, "passwordReset/form.html"));
})