require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT;
const app = express();
app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//main route

app.use(require('./routes'));
const options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'abels-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'abels-cert.pem'))
};

https.createServer(app).listen(PORT, () => {
    console.log('Server running')
})

// https.createServer(options, app).listen(PORT, () => {
//     console.log(`HTTPS listening on ${PORT}`);
// });