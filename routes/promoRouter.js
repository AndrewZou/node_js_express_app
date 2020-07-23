const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use( bodyParser.json() );

promoRouter.route("/")
.all((req, res, next) => {
    res.status = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req, res, next) => {
    res.end('<html><head>Express Website</head><body><div><h1>Will send the Promotion dishes to you!</h1></div><div><img src="./images/buffet.PNG"></div></body></html>');
})
.post((req, res, next) => {
    res.end('Will add this Promotion dish, Name: ' + req.body.name + ', Description: ' + req.body.description );
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported.');
})
.delete((req, res, next) =>{
    res.end('Wiil delete all Promotion dishes.');
});


promoRouter.route('/:promoId').get( (req, res, next)=>{
    res.end(`<html><head>Express Website</head><body><div><h1>Will send Promotion dish ${req.params.promoId } to you!</h1></div></body></html>`);
})
.post( (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported for /promotions/:promoId.');
})
.put( (req, res, next) => {    
    res.end(`Will update Promotion dish ${ req.params.promoId }`);    
})
.delete( (req, res, next) => {
    res.end(`Wiil delete Promotion dish ${req.params.promoId}.`);
});


module.exports = promoRouter;
