BookGenie
=========

<p>See it live here: https://warm-lowlands-41210.herokuapp.com/</p>

BookGenie is an app that allows users to exchange books with others in their area. Users can create a profile with basic information (including: their name, zipcode, and neighborhood) and a library that they can list all of their books in. Books can be added and deleted as needed. 

Users can search for books by title in the home page search bar. If there is a match, the user with the title in their library is returned. The first user can look at their basic information and other books in their library, and contact them via email if they want to request to borrow the book.

Users can also choose to browse the libraries of all other users in their area. Hitting the "Browse All Libraries" button will produce a scrollable list of all other users who have books in their libraries, and the scrollable libraries themselves.

The BookGenie logo at the top of the page is a clickable link that will redirect a user who is logged in back to the welcome page. If the user is not logged in (but is on the Sign Up page) and clicks the logo, they will be taken back to the login page.

Motivation
----------

Books are expensive, and the library doesn't alwyays have what I want to read readily available. Sometimes on my neighborhood's Facebook page, people ask if their neighbors have a certain title that can be borrowed, and most of the time somebody has it. I know I would use an app that focused solely on book trade, as would my bibliophile neighbors. 

Technology used
===============

<ul>
	<li>JavaScript/ jQuery</li>
	<li>Node/Express</li>
	<li>Mongo/Mongoose</li>
	<li>Travis CI</li>
	<li>Heroku/mLab</li>
	<li>JWT/Passport</li>
	<li>HTML</li>
	<li>CSS </li>
</ul>

Login Page
==========

<img src="/readme-images/home-screen.png" alt="screenshot of login screen"/>

Profile Page
============

<img src="/readme-images/profile-page.png" alt="screenshot of profile page"/>


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




