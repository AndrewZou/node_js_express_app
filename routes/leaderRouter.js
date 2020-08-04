const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
var authenticate = require('../authenticate');
var cors = require('./cors');

const leaderRouter = express.Router();

leaderRouter.use( bodyParser.json() );

leaderRouter.route("/")
.options(cors.corsWithOptions, (req, res) =>{ res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Leaders.find({})
    .then( leaders =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( leaders );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end('<html><head>Express Website</head><body><div><h1>Will get all leaders!</h1></div><div><img src="./images/alberto.PNG"></div></body></html>');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create( req.body )
    .then( leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( leader );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end('Will add this leader, Name: ' + req.body.name + ', Description: ' + req.body.description );
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported.');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Leaders.deleteMany({})
    .then( resp => {
        res.statusCode = 200;
        res.setHeader('Conten-Type', 'application/json');
        res.json( resp );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end('Wiil delete all leaders.');
});


leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next)=>{
    Leaders.findById( req.params.leaderId )
    .then( leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( leader );
    }, err=> next( err ))
    .catch( err => next( err ));
    //res.end(`<html><head>Express Website</head><body><div><h1>Will get leader ${req.params.leaderId } to you!</h1></div></body></html>`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported for /leaders/:leaderId.');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate( req.params.leaderId, {
        $set: req.body   
    }, { new: true } )
    .then( leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( leader );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end(`Will update leader ${ req.params.leaderId }`);    
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndDelete( req.params.leaderId )
    .then( resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( resp );
    }, err => next( err ))  
    .catch( err => next( err ));
    //res.end(`Wiil delete leader ${req.params.leaderId}.`);
});


module.exports = leaderRouter;
