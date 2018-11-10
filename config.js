'use strict';
//dotenv package looks for hidden .env file, if found uses values
require('dotenv').config();

//production (professional) database, local environment
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/bookgenie';

exports.PORT = process.env.PORT || 8081;


//just for tests
exports.TEST_DATABASE_URL = 'mongodb://localhost:27017/test-bookgenie';

//JWT authentication
exports.JWT_SECRET = process.env.JWT_SECRET 
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
