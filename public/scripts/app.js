"use strict"

$(function() {
	buttonToSignUpForm();
	submitSignUpForm();
	registerBrowseLibrariesButton();
	registerMyProfileButton();
	handleSignInForm();
	registerBookSearchButton();
	registerUpdateLibraryButton();
});


//function to handle sign-in form. Checks to see if user entered correct password, recieves token from server if so, is taken to welcome page
function handleSignInForm(){
	$('.userCredentials').submit(event => {
		event.preventDefault();
		let userData = {
			email: $('.email-entry').val(),
			password: $('.password-entry').val()
		}
		$.ajax({
			type: 'POST',
			url: '/auth/login',
			data: JSON.stringify(userData),
			success: function(res) {
				console.log(res);
				localStorage.setItem('authToken', res.authToken);
				localStorage.setItem('userId', res.user.id);
				$('.userCredentials').hide();
				$('.welcomePage').show();
				$('<p>').appendTo('.welcome-nametag').addClass('welcome-back-message').html(`Welcome back, ${res.user.firstName} !`);
			},
			error: function(res, status, error) {
	      //$('.userCredentials').reset();
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
				//window.alert(res.responseText);
				$('#login-user').hide();
				$('.login-error-message').remove();
				$('.existing-user-error-message-container').html("");
	      $('<p>').appendTo('.existing-user-error-message-container').addClass('login-error-message').html('Email already has a Book Genie account.<a href="index.html">Please sign in.</a>');
				$('.error-message-container').addClass('login-error-message').html('<p>There was an error processing your info, please try again</p>');
			},
			dataType: 'json',
			contentType: 'application/json'
		});

	});
}




//renders all user libraries (no title filter) onto the page
//passing renderAllLibraries as a callback to do something with the response data
//registers a click handler that loads all libraries from the API

function registerBrowseLibrariesButton(){
	$('.browseLibrariesButton').click(loadAllLibraries);
}

function loadAllLibraries() {
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
	if(users.length < 1) {
    $('.all-libraries-container').html("");
    const noDataMessage = 'Sorry, nobody has that book. Please try another search.';
    $('<p>').appendTo('.all-libraries-container').addClass('login-error-message').html(noDataMessage);
    $('.showAllLibraries').show();
   } else {
		let libraryCard = users.map(user => {
		//joining array of strings (books) in library that are <li> items so that can interpolate it
		let userLibrary = renderUserLibrary(user.library).join("");
		if (userLibrary == ""){
			userLibrary = '<li class="empty-library">This library is empty :(</li>'
		}
		return  `
		<div class="user-library-card">
			<img src="https://image.flaticon.com/icons/svg/29/29302.svg" class="book-stack-icon">
			<h2 class="firstName">${user.firstName}</h2>
			<h3 class="city">${user.city}</h3>
			<h3 class="zipcode">${user.zipcode}</h3>
			<a href="mailto:${user.email}?Subject=Book%20trade%20request%20from%20your%20neighbor%20on%20Book%20Genie" target="_top">Email ${user.firstName}</a>
			<h3 class="userLibraryTitle"><span>${user.firstName}'s library</span></h3>
			<ul class="userLibrary">${userLibrary}</ul>
		</div>   `
	})
	//	$('.welcomePage').hide();
$('.showAllLibraries').show();
$('.all-libraries-container').html(libraryCard); 
	}
}

//if no value is passed for userOwnsLibrary, then will set to false (to use on myProfile for updating books)
function renderUserLibrary(library, userOwnsLibrary=false){
	//buttons have data attributes so can use id to delete 
	let books = library.map(book => {
		let button = '';
		if (userOwnsLibrary) {
			button = `<button class="deleteBook" data-bookId="${book.id}">Delete</button>`;
		}
		return `
		<li>${book.title} ${button}</li>
		`
	})
	return books;
}

function registerBookDeleteButton(){
	$('.deleteBook').click(deleteBook);
}

function deleteBook(event){
	console.log('got here!!!!!');
	//takes attribute of data-bookId 
	let bookId = $(this).attr('data-bookId');
	let userId = localStorage.getItem('userId');
	console.log(bookId);
	$.ajax({
			type: 'DELETE',
			url: `/users/${userId}/library/${bookId}`,
			done: function(res, status, error) {
				if (status == 204){
					window.alert("Book deleted. Bang!");
	//if delete does not return user, then call loadMyProfile instead, which will make another ajax request ot get updated user profile
					renderMyProfile(res);
					console.log(res);
				}
			},
			error: function(res, status, error) {
				console.log(error);
				window.alert("Delete failed, please try again later.");
			},
			dataType: 'json',
			contentType: 'application/json'
		});
}


//listener event for book serach button
function registerBookSearchButton(){
	$('#searchForm').submit(loadSearchResults);
}

//calls API after button clicked above
//prevent default is here because fucntion gets called as part olistener event submit above
function loadSearchResults(event) {
	event.preventDefault();
	$.ajax({
		type: 'GET',
		data: {
			title: $('[name=bookSearchTerm]').val()
		},
		url: '/users',
		success: renderAllLibraries,
		dataType: 'json',
		contentType: 'application/json'
	});
};

//loads results of search
function renderSearchResults(results){
	console.log(results);		
}

function registerMyProfileButton(){
	$('.myProfileButton').click(loadMyProfile);
}

function loadMyProfile(event) {
	event.preventDefault();
	console.log("made it to render profile");
	//gets userId from localStorage 
	let userId = localStorage.getItem('userId');
	$.ajax({
		type: 'GET',
		url: `/users/${userId}`,
		success: renderMyProfile, 
		dataType: 'json',
		contentType: 'application/json'
	});
};
//data is passed from the API call to the function below, where map is applied to users
function renderMyProfile(user){
	let userLibrary = renderUserLibrary(user.library, true).join("");
	$('.welcomePage').hide();
	if (userLibrary == ""){
		userLibrary = '<li class="empty-library">Your library is currently empty. Add a book below!</li>'
	}
	$('.user-info-card-container').html(`
	<div class="user-profile-card">
	<h1 class="userName">${user.firstName} ${user.lastName}</h1>
	<h2 class="email">${user.email}</h2>
	<h3 class="city">${user.city}</h3>
	<h3 class="zipcode">${user.zipcode}</h3>
	<button type="button" role="button" class="update-profile-button">Update Information</button>
	</div>  

	<div class="user-library-card">
	<h3 class="userLibraryTitle"><span>${user.firstName}'s library</span></h3>
	<ul class="userLibrary">${userLibrary}</ul>
	</div> 
	`);
	//call registerBookDeleteButton here instead of at top because books need to load to page first
	registerBookDeleteButton();
	$('.myProfile').show();
	$('.all-libraries-container').hide();
	//$('.user-library-card').hide();
}
//HALP
function registerUpdateLibraryButton(){
	$('.addBookToLibrary').click(updateMyLibrary);
}
//pass into click event?

function isLibraryEmpty(){

}

/*
function doesTitleAlreadyExist(){
	let library = $('.userLibrary')
	let newTitle = $('[name=title]').val();
	for (let i = 0; i < library.length; i++){
		if (library[i] = newTitle){
			$('.existing-title-error-message-container').html("");
	      $('<p>').appendTo('.existing-title-error-message-container').addClass('login-error-message').html('');
				$('.error-message-container').addClass('login-error-message').html('<p>Looks like that book is already in your library</p>');
		}
	} else updateMyLibrary();
}
*/
function updateMyLibrary(event){
	event.preventDefault();
	let newTitle = $('[name=title]').val();
	let userId = localStorage.getItem('userId');
	let bookData = {title: newTitle};
	$.ajax({
			type: 'PUT',
			url: `/users/${userId}/library`,
			data: JSON.stringify(bookData),
			success: function(res) {
				renderMyProfile(res);
				console.log(res);
			},
			error: function(res) {
				console.log(res);
				window.alert(res.responseText);
			},
			dataType: 'json',
			contentType: 'application/json'
		});
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