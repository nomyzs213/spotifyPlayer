
const express = require('express');
const cookieParser = require('cookie-parser');
import {clientPath} from "../server.js";
const router = express.Router();

router.use(cookieParser());
router.get('/binding?status=completed' , async (req , res) => {
    const error = req.query.error;

    if(error) {
        res.redirect('/binding?status=cancelled');
        return;
    }

    await bindAccount(req, res);
})

router.get('/binding?status=cancelled',  (req, res) => {
     res.sendFile(clientPath + "/403.html")
})

async function bindAccount(req , res){
    const code = req.query.code;
    const state = req.query.state;
    const rawCookie = req.cookies.pending_registration;
    if(!rawCookie) return res.status(400).send('session expired or no cookie was set!');
    const {username , email , password}  = JSON.parse(req.cookies.pending_registration);
    const token = await getAccessToken(req, res);
}


async function getAccessToken(req , res){

}

export default router;