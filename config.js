'use strict';

//development database, mlab
exports.DATABASE_URL = process.env.DATABASE_URL || ''

exports.PORT = process.env.PORT || 8080;
//production database, local environment
exports.TEST_DATABASE_URL = '';
