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
	User.find()
	.then(users => {
		console.log("made it again!");
		res.json(users);
	})
	.catch(err => {
		console.log("hey we messed up");
		console.log(err);
		res.status(500).json({ error: 'something went wrong'});
	});
});


//returns all users who have a specified title that is searched for
router.get('/:id', (req, res) => {

})



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
    		zipcode: req.body.zipcode
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

//lets user add books to their library. Need to use id also to attach book to specific user library?
router.put('/:id', jsonParser, (req, res) => {
	if (req.body.library === undefined) {
   	 	return res.status(422).json({
      		code: 422,
      		reason: 'ValidationError',
      		message: 'Please enter a title',
    	});
  	}
  	console.log("we don't suck!")
	let updatedLibrary = {};
	requiredFields.forEach(field => {
		if(field in req.body){
			updatedLibrary[field] = req.body[field];
		}
	})
  	

  console.log(`Adding title (${req.params.id}) to library`)
  User.library.update({
  	title: req.body.id
  })
  	.then(item => {
  	res.status(204).end();
  })
  .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
      });
});

//for when user has posted a new item in their library

//for when user updates their profile info or edits item in library

//for when user deletes a title from their library
 /*router.delete('/:id' (req, res) => {
	//??? how to delete a title?
})
*/ 

module.exports=  router;