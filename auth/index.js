'use strict';
const authRouter = require('./authRouter');
const {localStrategy, jwtStrategy} = require('./strategies');

module.exports = {authRouter, localStrategy, jwtStrategy};
