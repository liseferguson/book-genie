"use strict"

$(function() {
	buttonToSignUpForm();
	submitSignUpForm();
	registerBrowseLibrariesButton();
	registerMyProfileButton();
	handleSignInForm();
	registerBookSearchButton();
	registerUpdateLibraryButton();
	registerUserInfoUpdateForm();
	toHomePage();
});

//When user clicks the BookGenie logo, they are redirected to the welcome page, if they are logged in. The other divs are hidden in case the user clicks the button while on that page. If they are not logged in, the button takes the user to the login page.
function toHomePage(){
	$('.header').click(function(event){
	event.preventDefault();
	if (localStorage.authToken){
	$('.welcomePage').show();
	$('.myProfile').hide();
	$('.showAllLibraries').hide();
	$('.updateProfileForm').hide();
	} else {
		window.location.href = "/";
		$('.signInForm').show();
		$('.welcomePage').hide();
		$('.signUpForm').hide();
		}
	});
}

//generic function that gets profile and calls callback funciton when done
function getMyProfile(callback) {
//gets userId from localStorage 
	let userId = localStorage.getItem('userId');
	$.ajax({
		type: 'GET',
		url: `/users/${userId}`,
		success: callback, 
		dataType: 'json',
		contentType: 'application/json'
	});
};

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
				localStorage.setItem('authToken', res.authToken);
				localStorage.setItem('userId', res.user.id);

				$('.userCredentials').hide();
				$('.showAllLibraries').hide();
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
		let $form = $('.signUpForm');
		let userData = {
//form uses jquery to get form element, calling find on form to find chil elements
			firstName: $form.find('[name=firstName]').val(),
			lastName: $form.find('[name=lastName]').val(),
			email: $form.find('[name=email]').val(),
			city: $form.find('[name=city]').val(),
			zipcode: $form.find('[name=zipcode]').val(),
			neighborhood: $form.find('[name=neighborhood]').val(),
			password: $form.find('[name=password]').val()
		};

//Make sure passwords match, then stop the page from loading farther if they do not.

		let password = $form.find('[name=password]').val();
		let password2 = $form.find('[name=password2]').val();
		if (password !== password2){
			$('.password-mismatch-error-message-container').html("");
			$('<p>').appendTo('.password-mismatch-message-container').addClass('login-error-message').html('Passwords must.userLibrary match');
		return;
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
    $('.myProfile').hide();
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
$('.showAllLibraries').show();
$('.all-libraries-container').html(libraryCard); 
$('.myProfile').hide();
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
	//takes attribute of data-bookId 
	let bookId = $(this).attr('data-bookId');
	let userId = localStorage.getItem('userId');
	$.ajax({
			type: 'DELETE',
			url: `/users/${userId}/library/${bookId}`,
			success: function(res, status, error) {
	//if delete does not return user, then call loadMyProfile instead, which will make another ajax request ot get updated user profile
				loadMyProfile(event);
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

function registerMyProfileButton(){
	$('.myProfileButton').click(loadMyProfile);
}

//when page first loads, has event to pass on. after update, does not have an event attached, so the if is put there to catch it either way
function loadMyProfile(event) {
	if (event != undefined) {
		event.preventDefault();
	} 
	getMyProfile(renderMyProfile);
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
		<h3 class="neighborhood">${user.neighborhood}</h3>
	</div>  

	<div class="user-library-card">
		<h3 class="userLibraryTitle"><span>${user.firstName}'s library</span></h3>
		<ul class="userLibrary">${userLibrary}</ul>
	</div> 
	`);
	//call registerBookDeleteButton here instead of at top because books need to load to page first
	registerBookDeleteButton();
	registerEditProfileButton();
	$('.myProfile').show();
	$('.showAllLibraries').hide();
	//$('.user-library-card').hide();
}

function registerUpdateLibraryButton(){
	$('.addBookToLibrary').click(updateMyLibrary);
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
			},
			error: function(res) {
				window.alert(res.responseText);
			},
			dataType: 'json',
			contentType: 'application/json'
		});
	document.getElementById("addBook").reset();
}

function registerEditProfileButton(){
	$('.button-to-update-info').click(loadEditProfilePage);
}

function loadEditProfilePage(event){
	event.preventDefault();
	getMyProfile(user=>{
		let $form = $('.updateProfileForm');
		$('.myProfile').hide();
		$form.show();
		$form.find('[name=firstName]').val(user.firstName);
		$form.find('[name=lastName]').val(user.lastName);
		$form.find('[name=city]').val(user.city);
		$form.find('[name=zipcode]').val(user.zipcode);
		$form.find('[name=neighborhood]').val(user.neighborhood);	
	})
	$('.updateProfileForm').show();
}

function registerUserInfoUpdateForm(){
	$('#userInfoUpdate').submit(saveUpdateProfile);
}

function saveUpdateProfile(event){
	event.preventDefault();
	let userId = localStorage.getItem('userId');
	let $form = $('.updateProfileForm');
	let userData = {
		//form uses jquery to get form element, calling find on form to find chil elements
		firstName: $form.find('[name=firstName]').val(),
		lastName: $form.find('[name=lastName]').val(),
		city: $form.find('[name=city]').val(),
		zipcode: $form.find('[name=zipcode]').val(),
		neighborhood: $form.find('[name=neighborhood]').val()
	};
	$.ajax({
		type: 'PUT',
		url: `/users/${userId}`,
		beforeSend: function(xhr) {
    	xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('authToken'));
    },
		data: JSON.stringify(userData),
		success: loadMyProfile, 
		dataType: 'json',
		contentType: 'application/json'
	});
	$('.updateProfileForm').hide();
}



