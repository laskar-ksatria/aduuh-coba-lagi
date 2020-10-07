require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const path = require('path');
const fs = require('fs');
const http = require('http');
const Socket = require('socket.io');

const HTTPS_PORT = process.env.HTTPS_PORT;
const HTTP_PORT = process.env.HTTP_PORT;
const app = express();

app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//HTTPS options
const options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'laskar-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'laskar-cert.pem'))
};

const http_Io = Socket(http.createServer(app));
const https_Io = Socket(https.createServer(options, app));

app.use((req,res,next) => {
    req.http_Io = http_Io;
    req.https_Io = https_Io;
    next();
});

//main route
app.use(require('./routes'));

http.createServer(app).listen(HTTP_PORT, () => {
    console.log("HTTP listening on " + HTTP_PORT)
});

https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS listening on ${HTTPS_PORT}`);
});

http_Io.on('connection', socket => {
    console.log("http Io connected");
    socket.on('disconnect', () => console.log("http Io disconnect"))
})

https_Io.on('connection', socket => {
    console.log("https Io connected");
    socket.on('disconnect', () => console.log("https Io disconnect"))
})