"use strict"

//importing 3rd party dependencies
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');
//router helps set up what endpoints are, routes request for incoming HTTP requests 
const router = express.Router();

//create a signed jwt
const createAuthToken = function (user) {
  return jwt.sign({ user }, JWT_SECRET, {
     subject: user.email,
     expiresIn: JWT_EXPIRY,
     algorithm: 'HS256'
   });
};

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

// The user provides an email and password to login and is given an authtoken
router.post('/login', localAuth, (req, res) => {
  console.log('made it to login!');
  const authToken = createAuthToken(req.user.serialize());
  res.json({
    authToken: authToken,
    user: req.user.serialize()
  });
});

const jwtAuth = passport.authenticate('jwt', {session: false});

//The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res, next) => {
  createAuthToken(req.user)
  .then(authToken => {
    res.json({
      authToken: authToken,
      userId: req.user._id,
      email: req.user.email
    });
  })
  .catch(err => {
    next(err);
  });
});

module.exports = router;