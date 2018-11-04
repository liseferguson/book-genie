"use strict";

const bcrypt = require('bcryptjs');

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
  neighborhood: { type: String, required: false },
  zipcode: { type: Number, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  library: { type: [bookSchema], required: false, unique: false}
});

//represents how the outside world sees our users
//Note to self: make tests to make sure serialize is working properly
userSchema.methods.serialize = function() {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    city: this.city,
    zipcode: this.zipcode,
    neighborhood: this.neighborhood,
    library: this.library.map(
        (book) => book.serialize()
      ),
    id: this._id
  };
};

//validate that password is sufficient
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

//encrpts pw with 10 salt rounds
userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

bookSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title
  };
};


//creates model via mongoose, params are database and schema
const User = mongoose.model('Users', userSchema);


module.exports = { User };