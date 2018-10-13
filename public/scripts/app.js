"use strict"

$(function() {
  buttonToSignUpForm();
  submitSignUpForm();
  registerBrowseLibrariesButton();
  registerMyProfileButton();
  handleSignInForm();
});


//function to handle sign-in form. Checks to see if user entered correct password, recieves token from server if so, is taken to welcome page
function handleSignInForm(){
	$('.userCredentials').submit(event => {
	  event.preventDefault();
	  console.log('email-entry is ' + $('.email-entry').val());
	  console.log('password-entry is ' +$('.password-entry').val());
	  let userData = {
	    email: $('.email-entry').val(),
	    password: $('.password-entry').val()
	  }
	  $.ajax({
	    type: 'POST',
//url below??
	    url: 'http://localhost:8081/auth/login',
	    data: JSON.stringify(userData),
	    success: function(res) {
	      localStorage.setItem('authToken', res.authToken);
	      localStorage.setItem('userId', res.userId);
	      localStorage.setItem('email', res.email);
	      $('.userCredentials').hide();
	      $('.welcomePage').show();
	    },
	    error: function(xhr, status, error) {
	      //$('.userCredentials').reset();
	      console.log(status);
	      $('.error-message-container').html("");
	      $('<p>').appendTo('.error-message-container').addClass('login-error-message').html('Your username or password was incorrect, please try again');
	    },
	    dataType: 'json',
	    contentType: 'application/json'
	  });
	});
}

//activates sign-up button to take user to sign-up form
function buttonToSignUpForm(){
	$('.new-user').click(function(event){
		$('.signUpForm').show();
		$('.signInForm').hide();
	});
}


//after user has filled out all required fields on form and hits "submit", taken to welcome page if correct credentials
function submitSignUpForm(){
	$('#userInfo').submit(event => {
	console.log("made it to submit signup form");
		event.preventDefault();
		let userData = {
			firstName: $('[name=firstName]').val(),
			lastName: $('[name=lastName]').val(),
			email: $('[name=email]').val(),
			city: $('[name=city]').val(),
			zipcode: $('[name=zipcode]').val(),
			password: $('[name=password]').val()
		};
//Make sure passwords match, then stop the page from loading farther if they do not.		
		if ('[password]' !== '[password2]'){
			$('.password-mismatch-error-message-container').html("");
	      	$('<p>').appendTo('.password-mismatch-message-container').addClass('login-error-message').html('Passwords much match');
		}
		$.ajax({
			type: 'POST',
			url: '/users',
			data: JSON.stringify(userData),
			success: function(res) {
		      localStorage.setItem('authToken', res.authToken);
		      localStorage.setItem('userId', res.userId);
		      localStorage.setItem('email', res.email);
		      $('.signUpForm').hide();
		      $('.welcomePage').show();
		      $('<h1>').appendTo('.welcomePage').addClass('create-account-success-message').html(`Welcome to Book Genie, ${userData.firstName}!`); 
		    },
		    error: function(res) {
		    	console.log(res);
		    	window.alert(res.responseText);
		      $('#login-user').hide();
		      $('.login-error-message').remove();

		      $('.error-message-container').addClass('login-error-message').html('<p>There was an error processing your info, please try again</p>');
		    },
		    dataType: 'json',
		    contentType: 'application/json'
		});
				
	})
}




//renders all user libraries (no title filter) onto the page
//passing renderAllLibraries as a callback to do something with the response data
//registers a click handler that loads all libraries from the API

function registerBrowseLibrariesButton(){
	$('.browseLibrariesButton').click(loadAllLibraries);
}

function loadAllLibraries() {
	console.log("made it to render libraries");
	$.ajax({
		type: 'GET',
		url: '/users',
		success: renderAllLibraries,
		dataType: 'json',
		contentType: 'application/json'
	});
};
//data is passed from the API call to the function below, where map is applied to users
function renderAllLibraries(users){
	let libraryCard = users.map(user => {
		//joining array of strings (books) in library that are <li> items so that can interpolate it
		let userLibrary = renderUserLibrary(user.library).join("");
	    return  `
	    <div class="user-library-card">
		    <h2 class="firstName">${user.firstName}</h2>
		    <h3 class="city">${user.city}</h3>
		    <h3 class="zipcode">${user.zipcode}</h3>
		    <h3 class="userLibraryTitle"><span>${user.firstName}'s library</span></h3>
		    <ul class="userLibrary">${userLibrary}</ul>
		    <a href="mailto:${user.email}?Subject=Book%20trade%20request%20from%20your%20neighbor%20on%20Book%20Genie" target="_top">Email ${user.firstName}</a>
	    </div>   `
	  })
	$('.welcomePage').hide();
	$('.showAllLibraries').show();
	$('.all-libraries-container').html(libraryCard); 
}

function renderUserLibrary(library){
	let books = library.map(book => {
		return `
		<li>${book.title}</li>
		`
	})
	return books;
}


//listener event for book serach button
function registerBookSearchButton(){
	$('.bookSearchTerm').click(loadSearchResults);
}

//calls API after button clicked above
function loadSearchResults() {
	console.log("made it to load search results");
	$.ajax({
		type: 'GET',
		url: '/users',
		success: renderSearchResults,
		dataType: 'json',
		contentType: 'application/json'
	});
};

//loads results of search
function renderSearchResults(users){

}



function registerMyProfileButton(){
	$('.myProfileButton').click(loadMyProfile);
}

function loadMyProfile() {
	console.log("made it to render profile");
	$.ajax({
		type: 'GET',
		url: '/users/${user._id}',
		success: renderMyProfile,
		dataType: 'json',
		contentType: 'application/json'
	});
};
//data is passed from the API call to the function below, where map is applied to users
function renderMyProfile(){
	    return  `
	    <div class="user-profile-card">
		    <h2 class="firstName">${user.firstName}</h2>
		    <h2 class="lastName">${user.lastName}</h2>
		    <h2 class="email">${user.email}</h2>
		    <h3 class="city">${user.city}</h3>
		    <h3 class="zipcode">${user.zipcode}</h3>
		    <h3 class="userLibraryTitle"><span>${user.firstName}'s library</span></h3>
		    <ul class="userLibrary">${userLibrary}</ul>
	    </div>   `
	  
	$('.welcomePage').hide();
}

function updateMyLibrary(){
	 
}

/*
function handleBookSearch(){
	$('.bookSearchTerm').click(event => {
	  event.preventDefault();
	  let searchTerm = {type: event.target.form.search.value}
	  $.get('/users', searchTerm)
	  .then(res => {
	    if(!res.users.length) {
	      $('.search-results-container').html("");
	      const noDataMessage = 'Sorry, nobody has that book. Please try another search.';
	      $('<p>').fadeIn().appendTo('.search-results-container').html(noDataMessage).attr('id', 'no-data-error');
	    } else {
	      renderTitleMatches(res);
	      $('#search-form').reset();
    }
  });
});
}
*/

//renders the profile cards of users who have searched book in their library. //will show search results on a map. User profile appear nest to house icon where user lives, with message saying how many copies of book are available, whether user is loaning or gifting, and an option to message them.
function renderProfileCards() {
	
}


//when clicked, takes user to their profile page
function userProfile(){

}