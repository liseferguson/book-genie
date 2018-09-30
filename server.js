'use strict';
//import 3rd party libraries
const express = require('express');
const app = express();
const morgan = require('morgan');

//creates a static web server, servers static assets
app.use(express.static('public'));
app.listen(process.env.PORT || 8080);


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//modularize routes
const { TEST_DATABASE_URL, PORT } = require('./config');

const usersRouter = require('./routes/usersRouter');
const authRouter = require('./routes/authRouter');

//log to http layer
app.use(morgan('common'));

// Parse request body
app.use(express.json());

//when requests come in, they get routed to the express router
app.use('/users', usersRouter);
//app.use('/auth', authRouter);

//catch all in case user enters non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Sorry, Not Found'});
})

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;



 function runServer(databaseUrl, port = PORT) { 
  return new Promise((resolve, reject) => { 
    mongoose.connect(databaseUrl, err => { 
      if (err) { return reject(err); } 
      server = app.listen(port, () => { 
        console.log(`Your app is listening on port ${port}`); 
        resolve(); }) 
      .on('error', err => { 
        mongoose.disconnect(); 
        reject(err); }); 
    }); 
  }); 
} 


// like runServer, this function also needs to return a promise. // server.close does not return a promise on its own, so we manually // create one. 
function closeServer() { 
  return mongoose.disconnect().then(() => { 
    return new Promise((resolve, reject) => { 
      console.log(`Closing server`); 
      server.close(err => { 
        if (err) { return reject(err); } 
        resolve(); 
      }); 
    }); 
  }); 
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(TEST_DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };