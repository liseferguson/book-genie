'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//Mongoose uses built in es6 promises
mongoose.Promise = global.Promise;

const { User } = require('../models');

//returns all users to be scrollable, list-style, on one screen
router.get('/', (req, res) => {
	console.log("hey we made it");
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
 User
  .findOne({ email: req.body.email })
  .then(user => {
  	console.log(JSON.stringify(user));
  	if (user) {
  		const message = 'This email already has a BookGenie account. Please sign in';
  		console.error(message);
  	    return res.status(400).send(message);
  	}
    else {
    	User
    	 .create({
    	 	firstName: req.body.firstName,
    		lastName: req.body.lastName,
    		password: req.body.password,
    		email: req.body.email,
    		city: req.body.city,
    		zipcode: req.body.zipcode,
        library: req.body.library
    	})
    	 .then(item => {
    	 	res.status(201).json(item);
    	 })
         .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
          });
   	 }
	});
}); //END OF POST REQUEST

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
  User.delete(req.body.library.title);
  console.log(`Deleted shopping list item \`${req.body.title}\``);
  res.status(204).end();
})
  

//for when user has posted a new item in their library

//for when user updates their profile info or edits item in library

//for when user deletes a title from their library
 /*router.delete('/:id' (req, res) => {
	//??? how to delete a title?
})
*/ 

module.exports=  router;