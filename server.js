'use strict';

const express = require('express');
const app = express();
app.use(express.static('public'));
app.listen(process.env.PORT || 8080);


const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');


app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

app.get('/', function(req, res){
  res.status(200);
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

/*this function connects to our database, then starts the server

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      } 
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
        //  mongoose.disconnect();
          reject(err);
        });
    });
  //});
}
/*

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
/*function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}*/ 

function runServer() { 
  const port = process.env.PORT || 8081; 
  return new Promise((resolve, reject) => { 
    server = app .listen(port, () => { 
      console.log(`Your app is listening on port ${port}`); 
      resolve(server); })
    .on("error", err => { reject(err); 
    }); 
  }); 
}

// like runServer, this function also needs to return a promise. // server.close does not return a promise on its own, so we manually // create one. 
function closeServer() { 
  return new Promise((resolve, reject) => { 
    console.log("Closing server"); 
    server.close(err => { 
      if (err) { reject(err); // so we don't also call resolve() 
      return; } resolve(); 
     }); 
  }); 
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };