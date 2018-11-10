
API Methods:
============

GET /users
==========

This method exposes all BookGenie users, their basic information and their libraries.


Authentication
--------------

This method requires authentication.

GET /:id
========

This method returns a specified user by their Mongoose-generated id. Used when exposing the books in a user's library, or returning a user's information card when said user has the book that was searched for in their library.


Authentication
--------------

This method requires authentication.