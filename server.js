'use strict';
//import 3rd party libraries
const express = require('express');

const morgan = require('morgan');
const passport = require('passport');

const usersRouter = require('./routes/usersRouter');

const { authRouter, localStrategy, jwtStrategy } = require('./auth');


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const app = express();

//log to http layer
app.use(morgan('common'));

passport.use(localStrategy);
passport.use(jwtStrategy);

// when requests come in, they get routed to the express router
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// use this with endpoints that are protected
const jwtAuth = passport.authenticate('jwt', { session: false });


//creates a static web server, servers static assets
app.use(express.static('public'));


// Parse request body
app.use(express.json());

//catch all in case user enters non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Sorry, Not Found'});
})


// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;



 function runServer(databaseUrl, port = PORT) { 
  console.log(`databaseUrl=`+databaseUrl);
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
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };