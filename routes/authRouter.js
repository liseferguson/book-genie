"use strict"



//importing 3rd party dependencies
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

//const localAuth = require('../auth/local-auth');
const jwtAuth = require('../auth/jwt-auth');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const localAuth = passport.authenticate('local', {session: false});

//create a signed jwt
const createAuthToken = function (user) {
  return new Promise(function (resolve, reject) {
    jwt.sign({ User }, JWT_SECRET, { expiresIn: JWT_EXPIRY }, function (err, authToken) {
      if (err) {
        return reject(err);
      }
      resolve(authToken);
    });
  });
};

// The user provides an email and password to login and is given an authtoken
router.post('/login', localAuth, (req, res, next) => {
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

// The user exchanges a valid JWT for a new one with a later expiration
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