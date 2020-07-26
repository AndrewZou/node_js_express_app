const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use( bodyParser.json() );

dishRouter.route("/")
.get((req, res, next) => {
    Dishes.find({})
    .then( dishes => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, err => next( err ))
    .catch( err => next( err ) );
    //res.end('<html><head>Express Website</head><body><div><h1>Will send all dishes to you!</h1></div><div><img src="./images/zucchipakoda.PNG"></div></body></html>');
})
.post((req, res, next) => {
    Dishes.create( req.body )
    .then( dish => {
        console.log("A new dish record created/saved.");
        res.status = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( dish );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end('Will add this dish, Name: ' + req.body.name + ', Description: ' + req.body.description );
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported.');
})
.delete((req, res, next) =>{
    Dishes.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end('Wiil delete all dishes.');
});


dishRouter.route('/:dishId')
.get( (req, res, next)=>{
    Dishes.findById( req.params.dishId )
    .then( dish => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( dish );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end(`<html><head>Express Website</head><body><div><h1>Will send dish ${req.params.dishId } to you!</h1></div></body></html>`);
})
.post( (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported for /dishes/:dishId.');
})
.put( (req, res, next) => {    
    Dishes.findByIdAndUpdate( req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then( dish => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( dish );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end(`Will update dish ${ req.params.dishId }`);    
}).delete( (req, res, next) => {
    Dishes.findByIdAndRemove( req.params.dishId )
    .then( resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json( resp );
    }, err => next( err ))
    .catch( err => next( err ));
    //res.end(`Wiil delete dish ${req.params.dishId}.`);
});


module.exports = dishRouter;
