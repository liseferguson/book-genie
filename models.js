"use strict";

const mongoose = require('mongoose');

//Mongoose uses built in es6 promises
mongoose.Promise = global.Promise;

//defining schema for users
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true, minlength: 5, maxlength: 50 },
  password: { type: String, required: true , minlength: 10, maxlength: 200 },
  city: { type: String, required: true },
  zipCode: { type: Number, required: true },
  email: { type: String, required: true, unique: true, lowercase: true }
});

//represents how the outside world sees our users
userSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    email: this.email || '',
    city: this.city || ''
  };
};

//defining schema for posts
const librarySchema = mongoose.Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  zipCode: { type: String, required: true },
  city: { type: String, required: true }
});

//represents how user libraries are represented outside our app via our api
librarySchema.methods.serialize = function() {
  return {
    title: this.title,
    username: this.user.username,
    zipCode: this.zipCode,
    city: this.city
  };
};


const user = mongoose.model('users', userSchema);
const libraryPost = mongoose.model('libraries', librarySchema);

module.exports = {User, SwapPost};