const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use( bodyParser.json() );

leaderRouter.route("/")
.all((req, res, next) => {
    res.status = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req, res, next) => {
    res.end('<html><head>Express Website</head><body><div><h1>Will get all leaders!</h1></div><div><img src="./images/alberto.PNG"></div></body></html>');
})
.post((req, res, next) => {
    res.end('Will add this leader, Name: ' + req.body.name + ', Description: ' + req.body.description );
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported.');
})
.delete((req, res, next) =>{
    res.end('Wiil delete all leaders.');
});


leaderRouter.route('/:leaderId').get( (req, res, next)=>{
    res.end(`<html><head>Express Website</head><body><div><h1>Will get leader ${req.params.leaderId } to you!</h1></div></body></html>`);
})
.post( (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported for /leaders/:leaderId.');
})
.put( (req, res, next) => {    
    res.end(`Will update leader ${ req.params.leaderId }`);    
})
.delete( (req, res, next) => {
    res.end(`Wiil delete leader ${req.params.leaderId}.`);
});


module.exports = leaderRouter;
