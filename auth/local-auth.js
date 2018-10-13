"use strict";

const bcrypt = require('bcryptjs');

const {User} = require('../models');

function localAuth(req, res, next) {
  console.log('made it to localAuth');
  const { email, password } = req.body;
  console.log('Im the request=', req.body);
  if (!email && !password) {
    const err = new Error('No credentials provided');
    err.status = 400;
    return next(err);
  }

  let user;
  return User.findOne({ email })
  .then(_user => {
   // user = _user;

    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      err.location = 'email';
      return Promise.reject(err);
    }

    return bcrypt.compare(password, user.password);
  })
  .then(isValid => {

    if (!isValid) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      err.location = 'password';
      return Promise.reject(err);
    }

    req.user = user;
    next();
  })
  .catch((err) => {
    next(err);
  });
}

module.exports = localAuth;