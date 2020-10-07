const express = require('express');
const Router = express.Router();

Router.get('/', (req,res,next) => {
    res.send("We connected to HTTPS")
});

Router.get('/setcookie', (req,res,next) => {
    let token = 'owlking'
    res.cookie('servertoken', token, {sameSite: 'none', secure: true, httpOnly: true});
    res.status(200).json({message: "Cookie has been set"})
})
Router.get('/getcookie', (req,res,next) => {
    let token = req.cookies.servertoken;
    console.log(req.cookies)
    res.status(200).json({token})
})

Router.get('/clearcookie', (req,res,next) => {
    res.clearCookie('servertoken');
    res.status(200).json({message: "Cookie has been clear"})
});

Router.get('/http-socket', (req,res,next) => {
    let http_Io = req.http_Io;
    http_Io.emit(`http-test`, "Hallo from server http");
})

Router.get('/https-socket', (req,res,next) => {
    https_Io.emit(`https-test`, "Hallo from server https");
})

module.exports = Router;