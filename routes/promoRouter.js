const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');
var authenticate = require('../authenticate');
var cors = require('./cors');

const promoRouter = express.Router();

promoRouter.use( bodyParser.json() );

promoRouter.route("/")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Promotions.find({})
    .then( promotions => {
        //console.log(">>>>>>>>", promotions );
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( promotions );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end('<html><head>Express Website</head><body><div><h1>Will send the Promotion dishes to you!</h1></div><div><img src="./images/buffet.PNG"></div></body></html>');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create( req.body )
    .then( promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( promotion );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end('Will add this Promotion dish, Name: ' + req.body.name + ', Description: ' + req.body.description );
})
.put(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported.');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Promotions.deleteMany({})
    .then( resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( resp );
    }, err => next( err ))
    .catch( err => next( err ) );
    //res.end('Wiil delete all Promotion dishes.');
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next)=>{
    Promotions.findById( req.params.promoId )
    .then( promotion => {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json');
        res.json( promotion );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end(`<html><head>Express Website</head><body><div><h1>Will send Promotion dish ${req.params.promoId } to you!</h1></div></body></html>`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported for /promotions/:promoId.');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {    
    Promotions.findByIdAndUpdate( req.params.promoId, {
        $set: req.body
    }, {new: true} )
    .then( promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( promotion );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end(`Will update Promotion dish ${ req.params.promoId }`);    
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndRemove( req.params.promoId )
    .then( resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( resp );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end(`Wiil delete Promotion dish ${req.params.promoId}.`);
});


module.exports = promoRouter;
