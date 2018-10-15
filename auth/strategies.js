'use strict';

//look for user email and look for it in the database
const { Strategy: LocalStrategy } = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../models');
const { JWT_SECRET } = require('../config');

// This is the login portion of the auth, used when email and password are passed to /auth/login
const localStrategy = new LocalStrategy(
  // This is needed because the username field is actually called email
  {usernameField: 'email', passwordField: 'password'},
  (email, password, callback) => {
  //define user so that it cn exist outside of userFound callback scope
  let user;
  User.findOne({ email: email })
    .then(userFound => {
      if (!userFound) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        console.log('user not found by email: ' + email);
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      // pushing userFound to outer scope, so that it is available in next call
      user = userFound
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        console.log('invalid password');
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return callback(null, user);
    })
    .catch(err => {
      console.log('Login ERROR:');
      console.log(err);
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

// This is the protected endpoint token verification portion, used when a token is passed (after login)
const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };