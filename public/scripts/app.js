"use strict"

$(function() {
  buttonToSignUpForm();
  submitSignUpForm();
});


//function to handle sign-in form. Checks to see if user entered correct password, recieves token from server if so, is taken to welcome page
function handleSignInForm(){
	$('.userCredentials').submit(event => {
	  event.preventDefault();
	  let userData = {
	    email: $('.email').val(),
	    password: $('.password').val()
	  }
	  $.ajax({
	    type: 'POST',
//url below??
	    url: '/auth/login',
	    data: JSON.stringify(userData),
	    success: function(res) {
	      localStorage.setItem('authToken', res.authToken);
	      localStorage.setItem('userId', res.userId);
	      localStorage.setItem('email', res.email);
	      $('.userCredentials').hide();
	      $('.welcomePage').show();
	    },
	    error: function() {
	      $('.userCredentials').reset();
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
			console.log(userData);
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
		      $('<p>').appendTo('.welcomePage').addClass('create-account-success-message').html(`Welcome to the Book Genie, ${userData.firstName}!`);
		      $('.welcomePage').show();
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


//makes sure both password fields are equal

//allows user to scroll through all neighbor libraries (list form, not map)
function loadAllLibraries() {
  $.get('/users/libraries')
  .then(res => {
    renderAllLibraries(res);
  });
};

//renders all user libraries (no title filter) onto the page
function renderAllLibraries(data) {
  let libraryCard = data.users.map(users => {
    return  `
    <div class="search-results-card">
    <h5 class="userName">${user.firstName}</h5>
    <h5 class="email">${user.email}</h5>
    <h5 class="city">${user.city}</h5>
    <h5 class="zipcode">${user.zipcode}</h5>
    <h5 class="userLibrary"><span>${user.firstName}'s + "library"</span></h5>
    </div>
    `
  })
  $('.all-libraries-container').html(libraryCard);
};


//listener event that handles the search button. Assigns search terms to searchTerm variable
function handleBookSearch(){
//submit button > AJAX get request to server for specified search params
	$('.bookSearchTerm').click(event => {
	  event.preventDefault();
	  let searchTerm = {type: event.target.form.search.value}
	  $.get('/users', searchTerm)
	  .then(res => {
	    if(!res.users.length) {
	      $('.search-results-container').html("");
	      const noDataMessage = 'Sorry, nobody has that book. Please try another search.';
	      $('<p>').fadeIn().appendTo('#search-results-container').html(noDataMessage).attr('id', 'no-data-error');
	    } else {
	      renderTitleMatches(res);
	      $('#search-form').reset();
    }
  });
});
}

//At top of screen, will show message saying how many neighbors have copies of the book available.
function renderTitleMatches(){
 
}

//renders the profile cards of users who have searched book in their library. //will show search results on a map. User profile appear nest to house icon where user lives, with message saying how many copies of book are available, whether user is loaning or gifting, and an option to message them.
function renderProfileCards() {
	
}


//when clicked, takes user to their profile page
function userProfile(){

}