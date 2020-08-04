var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config.js');
const { NotExtended } = require('http-errors');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};
var isAdministrator = false;
var adminUser = {};
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                console.log(">>>>Found token", user);
                if( user.admin ){
                    adminUser = user;
                    console.log("Administrator Rights User");
                    isAdministrator = true;
                }
                return done(null, user, isAdministrator);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});
/*
passport.use( new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            console.log(">>>>>>>", err);
            return done(err, false);
        }
        if (user.admin) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));
exports.verifyAdmin = passport.authenticate('jwt', {session: false});
*/
exports.verifyAdmin = function(req, err, next) {
    //console.log( ">>>>>>>verifyAdmin", req.user );
     if ( req.user.admin ){
       return next();
    } else {
      var err = new Error('Only administrators are authorized to perform this operation.');
      err.status = 403;
      return next(err);
    }
};

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));
