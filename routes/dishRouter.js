const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use( bodyParser.json() );

dishRouter.route("/")
.all((req, res, next) => {
    res.status = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req, res, next) => {
    res.end('<html><head>Express Website</head><body><div><h1>Will send all dishes to you!</h1></div><div><img src="./images/zucchipakoda.PNG"></div></body></html>');
})
.post((req, res, next) => {
    res.end('Will add this dish, Name: ' + req.body.name + ', Description: ' + req.body.description );
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported.');
})
.delete((req, res, next) =>{
    res.end('Wiil delete all dishes.');
});


dishRouter.route('/:dishId').get( (req, res, next)=>{
    res.end(`<html><head>Express Website</head><body><div><h1>Will send dish ${req.params.dishId } to you!</h1></div></body></html>`);
})
.post( (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported for /dishes/:dishId.');
})
.put( (req, res, next) => {    
    res.end(`Will update dish ${ req.params.dishId }`);    
}).delete( (req, res, next) => {
    res.end(`Wiil delete dish ${req.params.dishId}.`);
});


module.exports = dishRouter;
