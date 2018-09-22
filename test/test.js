'use strict';


const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server');

//const isEqual = require('isEqual');

describe('isEqual', function() {
	before(function() {
    	return runServer();
  	});

	after(function() {
    	return closeServer();
  	});
  	
    it('should give right answers for equal and unequal inputs', function(){
      return chai.request(app)
        .get('/')
        .then(function(res) {
          // so subsequent .then blocks can access response object
         // res = _res 
          expect(res).to.have.status(200);
        });
    });
  }
);
