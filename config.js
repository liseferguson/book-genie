'use strict';

//production (professional) database, local environment
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/bookgenie';

exports.PORT = process.env.PORT || 8081;

//development (garbage) database, mlab
exports.DEV_DATABASE_URL = process.env.DEV_DATABASE_URL || 'mongodb://localhost:27017/bookgenie';

//just for tests
exports.TEST_DATABASE_URL = 'mongodb://localhost:27017/test-bookgenie';

//exports.TEST_PROD_DATABASE_URL = 'mongodb://demo:password1@ds147233.mlab.com:47233/test-bookgenie';

//JWT authentication
//in profesh world, do not type secret key, store in secret environment in server and use first portion of code to access it
exports.JWT_SECRET = process.env.JWT_SECRET 
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
