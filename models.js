"use strict";

const mongoose = require('mongoose');

//Mongoose uses built in es6 promises
mongoose.Promise = global.Promise;


//defining schema forbook lists
const bookSchema = mongoose.Schema({
  title: { type: String, required: true }
});

//defining schema for users
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true , minlength: 5, maxlength: 200 },
  city: { type: String, required: true },
  zipcode: { type: Number, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  library: { type: [bookSchema], required: false, unique: false}
});

//represents how the outside world sees our users
userSchema.methods.serialize = function() {
	console.log('made it to serialize');
  return {
    firstName: this.firstName,
    email: this.email,
    city: this.city
    //library: this.library
  };
};


//creates model via mongoose, params are database and schema
const User = mongoose.model('Users', userSchema);


module.exports = { User };