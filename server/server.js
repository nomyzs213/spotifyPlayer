const express = require("express");
const path = require("node:path");
const cors = require("cors");

const app = express();

export const clientPath = path.resolve(__dirname , "./client/views");

app.use(cors());
app.use(express.json());

app.get('/main' , (req ,res) => {
    res.sendFile(clientPath + "/index.html");
})

app.all('*' , (req , res) => {
    res.sendFile(clientPath + "/404.html");
} )

