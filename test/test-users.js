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

describe('/users endpoints', function() {

    let newUser = {
      firstName:"Sally",
      lastName:"Student",
      password:"password",
      email:"testing@gmail.com",
      city:"Portland",
      zipcode:97213,
      library:[
      {title:"Book1"}, 
      {title:"Book2"}, 
      {title:"Book3"}
      ]
    };

    let otherUser = {
      firstName:"Steve",
      lastName:"Stupid",
      password:"password",
      email:"stupid@gmail.com",
      city:"Portland",
      zipcode:97219,
      library:[
      {title:"Book9"}, 
      {title:"Book10"}, 
      {title:"Book3"}
      ]
    };

    let otherOtherUser = {
      firstName:"Stupid",
      lastName:"Stupid",
      password:"password",
      email:"stop@gmail.com",
      city:"Portland",
      zipcode:97219,
      library:[
      {title:"Book6"}, 
      {title:"Book7"}, 
      {title:"Book8"}
      ]
    };

    
    afterEach(function() {
     
    });

    before(function() {
      return runServer(TEST_DATABASE_URL, PORT);
    });

    after(function() {
      tearDownDb();
    	return closeServer();
    });

    describe('POST /users', function(){

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

      it('should create other user', function(){
        return chai.request(app)
        .post('/users')
        .send(otherUser)
        .then(function(res) {   
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.include.keys("firstName", "lastName", 'password', "email", "city", "zipcode");
          expect(res.body.email).to.equal(otherUser.email);
      });
      });

      it('should create other other user', function(){
        return chai.request(app)
        .post('/users')
        .send(otherOtherUser)
        .then(function(res) {   
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.include.keys("firstName", "lastName", 'password', "email", "city", "zipcode");
          expect(res.body.email).to.equal(otherOtherUser.email);
      });
      });

    });

    describe('GET /users', function(){

      it('should return all users', async function(){
  //      let newUser1 = await addUser(newUser);
  //      let newUser2 = await addUser(otherUser);


        return chai.request(app)
        .get('/users')
        .then(function(res){
          expect(res).to.have.status(200);
          //deep equal does a full property name and value match, instead of object identity match, which i got before deep equal
          expect(res.body).to.deep.equal([newUser, otherUser, otherOtherUser]);
        })
      })

      describe('with a title search', function(){
        it('should return users that have searched title in their library', async function(){
          //async tells function to look out for asynchronous actviity
    //      let newUser1 = await addUser(newUser);
     //     let newUser2 = await addUser(otherUser);
     //     let newUser3 = await addUser(otherOtherUser);

          return chai.request(app)
          .get('/users?title=Book3')
          .then(function(res){
          //deep equal does a full property name and value match, instead of object identity match, which i got before deep equal
            expect(res.body).to.deep.equal([newUser, otherUser]);
          })
        })
      })
    })

    describe('PUT /users', function(){

      it('should add a book to library', function(){
      // strategy:
    //  1. Get an existing library from db
    //  2. Make a PUT request to update that library
    //  3. Prove library returned by request contains new book we sent
    //  4. Prove library in db is correctly updated
    //makes a new user and stores in test db, makes it so don't have to use POST endpoint to test PUT endpoint, because that might mess up stuff
  //  return addUser(newUser).then(function(user) {
      
      User.findOne()
    //grabs a user and then grabs its id to be used in the endpoint
       .then(function(user){
        return chai.request(app)
        .put(`/users/${user.id}/library`)
        .send({title: "Book Title"})
        .then(function(res){
          console.log("add user console log" + JSON.stringify(res.body));
          expect(res).to.have.status(204);
          return User.findById(user.id)	
        })
        .then(function(updatedUser){
          return expect(updatedUser.library).to.equal({title: "New Book Title"});
          expect(res.body).to.include({title: "New Book Title"});
         })
        })
      })
    })

    describe('DELETE /users', function(){

      it('should delete a book from a user library', function(){
        User.library.findById()
      //find book by its given id
          .then(function(){
            return chai.request(app)
            //endpoint for deleted book id?
            .delete(`/users/${user.id}/library/${book.id}`)
          })
          .then(function(res) {
            expect(res).to.have.status(204);
            return User.library.findById(book.id);
           })
          .then(function(deletedBook) {
            expect(deletedBook).to.be.null;
          });
      })
    })
})
//})

