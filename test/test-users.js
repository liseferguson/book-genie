'use strict';


const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const mongoose = require('mongoose');



const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL, PORT} = require('../config');

chai.use(chaiHttp);

const { User } = require('../models');

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

function addUser(user){
	return User.create(user);
}

describe('Obtaining all users and their libraries', function() {

	const firstName = "Sally";
	const lastName = "Student";
	const password = "password";
	const email = "testing@gmail.com";
	const city = "Portland";
	const zipcode = "97213";


	let newUser = {
		firstName:"Sally",
	    lastName:"Student",
	    password:"password",
	    email:"testing@gmail.com",
	    city:"Portland",
	    zipcode:"97213"
	}

	afterEach(function() {
		return tearDownDb();
 	});

	before(function() {
		console.log("hi");
    	return runServer(TEST_DATABASE_URL, PORT);
  	});

	after(function() {
    	return closeServer();
  	});

    it('should create a new user', function(){
      return chai.request(app)
        .post('/users')
        .send(newUser)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.include.keys("firstName", "lastName", 'password', "email", "city", "zipcode");
          expect(res.body.email).to.equal(newUser.email);
        });
    });
    it('should add a book to library', function(){
    	//makes a new user and stores in test db, makes it so don't have to use POST endpoint to test PUT endpoint, because that might mess up stuff
    	return addUser(newUser).then(function(user) {
    		return chai.request(app)
    		.put(`/users/${user._id}`)
    		.send({title: "Book Title"})
    		.then(function(res){
    			expect(res.body).to.be.empty;
    			expect(res).to.have.status(204);
    			return User.findById(user._id)	
    		})
    		.then(function(updatedUser){
    			return expect(updatedUser.library).to.equal([{title: "Book Title"}]);
    		})
    		
    	})
    	
    });
  }
);
