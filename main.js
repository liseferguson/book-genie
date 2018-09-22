'use strict'

//is global variable because user might want to start another search any time in app
let currentSearchTerm = "";

//grabs user first name, which is saved in the database
let userName = "";

//function to handle sign-in form. Checks to see if user entered correct password
function handleSignInForm(){

}

//activates sign-up button to take user to sign-up form

function buttonToSignUpForm(){
	$('.signUpButton').click(function(event){
		$('.signUpForm').css('display', 'block');
	});
}

//after user has filled out all required fields on form and hits "submit"
function submitSignUpForm(){

}

//after user signs in with correct email and password, is taken to welcome page
function welcomePage(){
	
}

//listener event that handles the search button. Assigns search terms to currentSearchTerm variable
function handleBookSearch(){

}

//At top of screen, will show message saying how many neighbors have copies of the book available.
function resultsMessage(){
 
}

//renders the profile cards of users who have searched book in their library. //will show search results on a map. User profile appear nest to house icon where user lives, with message saying how many copies of book are available, whether user is loaning or gifting, and an option to message them.
function renderProfileCards() {
	
}


//allows user to scroll through all neighbor libraries (list form, not map)
function viewAllLibrariesList(){

}

//allows user to see all libraries on a map, represented by house icons. When hover over icon, image of user profile card appears.
function viewLibrariesMap(){

}

//when clicked, takes user to their profile page
function userProfile(){

}

//when user clicks home button icon, will redirect to welcome page
function homeButton(){

}