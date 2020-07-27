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

//Router for sub document object CRUD operations
dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById( req.params.dishId)
    .then( dish =>{
        if( dish != null ){
            res.status = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json( dish.comments );
        }
        else{
            err = new Error('Dish ' + req.params.dishId + ' not found.');
            err.status = 404;
            return next( err );
        }
    }, err => next( err ))
    .catch( err => next( err ));
})
.post((req, res, next) => {
    Dishes.findById( req.params.dishId )
    .then( dish => {
        if( dish != null ){
            dish.comments.push( req.body );
            dish.save()
            .then( dish => {
                res.status = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json( dish.comments );
            });            
        }
        else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next( err );
        }
    }, err => next( err ))
    .catch( err => next( err ));
})
.put((req, res, next) => {
    res.status = 403;
    res.end('PUT operation not supported on route /dishes/' + req.params.dishId + '/comments');
})
.delete((req, res, next) => {
    Dishes.findById( req.params.dishId )
    .then( dish => {
        if( dish != null ){
            if( dish.comments.length > 0 ){
                //dish.comments.length = 0;
                for(var index = dish.comments.length -1; index >= 0; index--) 
                    dish.comments.id( dish.comments[index]._id).remove();
                dish.save()
                .then( dish => {
                    res.status = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json( dish );
                });
            }
            else{
                err = new Error('Dish ' + req.params.dishId +' not comments found');
            err.status = 404;
            return next( err );
            }
        }
        else{
            err = new Error('Dish ' + req.params.dishId +' not found');
            err.status = 404;
            return next( err );
        }
    }, err => next( err ))
    .catch( err => next( err ));
})

//Router for sub document object CRUD operations
dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById( req.params.dishId )
    .then( dish => {
        if( dish != null && dish.comments.id( req.params.commentId ) != null ){
            res.status = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json( dish.comments.id( req.params.commentId) );
        }
        else if( dish == null ){
            err = new Error('Dish ' + req.params.dishId +' not found');
            err.status = 404;
            return next( err );
        }
        else{
            err = new Error('Dish ' + req.params.dishId +' no comments found');
            err.status = 404;
            return next( err );
        }
    })
    .catch( err  => next( err ));
}, err => next( err ))
.post((req, res, next) => {
    res.status = 403;
    res.end('POST operation is not supported for route /dishes/:dishId/comments/:commentId.');    
}, err => next( err))
.put((req, res, next) => {
    Dishes.findById( req.params.dishId )
    .then( dish =>{
        if( dish != null && dish.comments.id( req.params.commentId ) != null){
            if( req.body.rating ){
                dish.comments.id( req.params.commentId ).rating = req.body.rating;
            }
            if( req.body.comment ){
                dish.comments.id( req.params.commentId ).comment = req.body.comment;
            }
            dish.save()
            .then( dish =>{
                res.status = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json( dish );
            }, err => next( err ));
        }
        else if( dish == null )
        {
            err = new Error('DISH ' + req.params.dishId +' not found.');
            err.status = 404;
            return next( err );
        }
        else{
            err = new Error('DISH ' + req.params.dishId +' no comments found.');
            err.status = 404;
            return next( err );
        }
    }, err => next( err ))
    .catch( err => next( err ));
})
.delete((req, res, next) => {
    Dishes.findById( req.params.dishId )
    .then( dish => {
        if( dish != null && dish.comments.id( req.params.commentId ) != null ){
            dish.comments.id( req.params.commentId ).remove();
            dish.save()
            .then( dish => {
                res.status = 200;
                res.setHeader('Content-Type', 'application/json');
            }, err => next( err ))
            .catch( err => next( err ));
        }
        else if( dish == null ){
            err = new Error('Dish ' + req.params.dishId + ' not found.');
            err.status = 404;
            return next( err );
        }
        else{
            err = new Error('Dish ' + req.params.dishId + ' no comments found.');
            err.status = 404;
            return next( err );
        }        
    }, err => next( err ))
    .catch( err => next( err ));
});


module.exports = dishRouter;
