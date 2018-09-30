'use strict';


const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server');


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
          expect(res.body).to.have.all.keys("firstName", "lastName", 'password', "email", "city", "zipcode");
          expect(res.body.email).to.equal(newUser.email);
        });
    });
  }
);
