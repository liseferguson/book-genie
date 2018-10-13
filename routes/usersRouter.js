'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Mongoose uses built in es6 promises
mongoose.Promise = global.Promise;

const { JWT_SECRET, JWT_EXPIRY } = require('../config');
const { User } = require('../models');

//create a signed jwt
const createAuthToken = function (user) {
  return new Promise(function (resolve, reject) {
    jwt.sign({ user }, JWT_SECRET, { expiresIn: JWT_EXPIRY }, function (err, authToken) {
      if (err) {
        console.log(`createAuthToken: `+ err);
        return reject(err);
      }
      resolve(authToken);
    });
  });
};

//returns all users to be scrollable, list-style, on one screen
router.get('/', (req, res) => {
	console.log("hey we made it");
  //where back end and front end meet
  let title = req.query.title;
//returns all users who have a specified title that is searched for
	User.find()
	.then(users => {
		console.log("made it again!");
    if (title !== undefined){
      users = filterUsersByTitle(users, title);
    } 
    res.json(
      users.map(
        (user) => user.serialize()
      )
    );
  })
	.catch(err => {
		console.log("hey we messed up");
		console.log(err);
		res.status(500).json({ error: 'something went wrong'});
	});
});

//iterates over users, filters out indivual libraries, then iterates over libraries, filters out titles that match search terms
function filterUsersByTitle(users, title){
  let matchingUsers = [];
  for (let i = 0; i < users.length; i++){
    let user = users[i]
    console.log(user);
    for (let j = 0; j < user.library.length; j++){
      //add user with matching title to output
      let foundTitle = user.library[j].title
      console.log(title + '/' + foundTitle); 
      if (title == foundTitle){
        matchingUsers.push(user);
      //stop loop, stop looking through library if title found 
        break;
      }
    } 
  }
  return matchingUsers;
}




//for when user has created a new profile


router.post("/", jsonParser, (req, res) => {
	const requiredFields = ['firstName', 'lastName','password', 'email', 'city', 'zipcode'];
	const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  //all of this is authentication stuff
  //make sure strings are fields so that can trim whitespace off if unintentionally added by user
  //zipcode is number, so just leave off?
  const stringFields = ['firstName', 'lastName', 'password', 'email', 'city'];
  const nonStringField = stringFields.find(field =>
    (field in req.body) && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicitlyTrimmedFields = ['email', 'password'];

  const nonTrimmedField = explicitlyTrimmedFields.find(field =>
    req.body[field].trim() !== req.body[field]
  );
  const sizedFields = {
    password: {
      min:5,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(field =>
    'min' in sizedFields[field] &&
    req.body[field].trim().length < sizedFields[field].min
    );
  const tooLargeField = Object.keys(sizedFields).find(field =>
    'max' in sizedFields[field] &&
    req.body[field].trim().length > sizedFields[field].max
    );
  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
      ? `Must be at least ${sizedFields[tooSmallField]
        .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
          location: tooSmallField || tooLargeField
        });
  }
//password has no default value

  let {password, firstName = '', lastName = '', email = '', city = '', zipCode = ''} = req.body;
      // Username and password come in pre-trimmed, otherwise we throw an error before this
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  city = city.trim();
  zipCode = zipCode.trim();
  
  User
  .find({ email: req.body.email })
  .count()
  .then(count => {
    if (count > 0) {
      const message = 'This email already has a BookGenie account. Please sign in';
      console.error(message);
      return res.status(400).send(message);
    }
    return User.hashPassword(password);
    })//END OF USER.FIND
    .then (hash => {
      console.log('creating user');
      return User
      .create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hash,
        email: req.body.email,
        city: req.body.city,
        zipcode: req.body.zipcode,
        library: req.body.library
      });
    })
      // If there is no existing user, hash the password
      .then(user => {
        console.log('creating authToken');
        return createAuthToken(user)
        .then(authToken => {
          return res.status(201).json({
            authToken: authToken,
            userId: user._id,
            email: user.email
          });
        });
      })
      .catch(err => {
        console.log('caught error' + err);
        // Forward validation errors on to the client, otherwise give a 500
        // error because something unexpected has happened
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        res.status(500).json({code: 500, message: 'Internal server error'});
      }); //END OF CATCH
 }); 
    //END OF POST REQUEST



//lets user add books to their library. Also edit titles already there?
router.put('/:id/library', jsonParser, (req, res) => {
	return res.status(204).json({});
	//fill this code in with code that takes req, updates user by adding body, add title to user library, if sucessful return 204 otherwise error
  console.log(`Adding book to library`);
  const toUpdate = {};
  const updateableFields = ['title'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  User
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.body.library, { $push: toUpdate })
    .then(restaurant => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//delete a book from a user library

router.delete('/:id/library', (req, res) => {
  User.delete(req.body.title);
  console.log(`Deleted title \`${req.body.title}\``);
  res.status(204).end();
});


module.exports =  router;

