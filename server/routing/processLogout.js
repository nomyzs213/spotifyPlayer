import express from "express";
import proceedLogout from "../controllers/logout.js";

const logout = express.Router();

logout.get('/logout' , async (req, res) => {
     await proceedLogout(req, res);
});

