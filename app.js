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

const httpServer = http.createServer(app);
const httpsServer = http.createServer(options, app);

const httpIo = Socket(httpServer);
const httpsIo = Socket(httpsServer);

app.use((req,res,next) => {
    req.httpIo = httpIo;
    req.httpsIo = httpsIo;
    next();
});

//main route
app.use(require('./routes'));

httpServer.listen(HTTP_PORT, () => {
    console.log("HTTP listening on " + HTTP_PORT)
});

httpsServer.listen(HTTPS_PORT, () => {
    console.log(`HTTPS listening on ${HTTPS_PORT}`);
});

httpIo.on('connection', socket => {
    console.log("http Io connected");
    socket.on('disconnect', () => console.log("http Io disconnect"))
})

httpsIo.on('connection', socket => {
    console.log("https Io connected");
    socket.on('disconnect', () => console.log("https Io disconnect"))
})