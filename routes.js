const express = require('express');
const Router = express.Router();

Router.get('/', (req,res,next) => {
    res.send("We connected to HTTPS")
})

Router.get('/setcookie', (req,res,next) => {
    let token = 'owlking'
    res.cookie('servertoken', token);
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
})

module.exports = Router;