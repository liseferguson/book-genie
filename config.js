'use strict';

//production (professional) database, local environment
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://demo:password1@ds113693.mlab.com:13693/bookgenie'

exports.PORT = process.env.PORT || 8081;

//development (garbage) database, mlab
exports.DEV_DATABASE_URL = 'mongodb://localhost:27017/bookgenie';

//just for tests
exports.TEST_DATABASE_URL = 'mongodb://localhost:27017/test-bookgenie';
