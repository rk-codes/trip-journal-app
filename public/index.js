const BASE_URL = 'http://localhost:8080/';
let authToken;

function tripToHtml(trip, isTripListDisplay=true){
	let html = "";
	const options = {year: 'numeric', month: 'short', day: 'numeric'};

	if(isTripListDisplay) {
	html = `
	<li class="trip-item">
		<a class="tripname" data-id="${trip.id}">${trip.name}</a>
		<i class="fa fa-calendar-o" style="font-size:24px"></i>
		<span>${new Date(trip.startDate).toLocaleDateString('en-US',options)}  - ${new Date(trip.endDate).toLocaleDateString('en-US',options)} </span>
		<p>
			<i class="fa fa-flag" style="font-size:24px"></i><span class-"trip-country">${trip.country}</span>
		</p>
		<button class="edit-trip-button icon-button" data-id="${trip.id}"><i class="fa fa-edit fa-lg"></i></button>
		<button class="delete-trip-button icon-button" data-id="${trip.id}"><i class="fa fa-trash fa-lg"></i></button>
		
	</li>
	`
	}
	else{
		html = `
			<div class="trip-info">
			<div class="before-trip"></div>
			<div class="trip-info-box">
				<h3>${trip.name}</h3>
				<div class="trip-date">
					<span>${new Date(trip.startDate).toLocaleDateString('en-US',options)} - ${new Date(trip.endDate).toLocaleDateString('en-US',options)}</span>
				</div>
				<p>${trip.description}</h2>
			</div>
			<div class="after-trip"</div>
			</div>
			<div class="places-box">
				<div class="places-container">
				
					${placesToHtml(trip)}
			
				</div>
				<div class="places-buttons-box">
					<input type="button" data-id="${trip._id}" class="add-place-button form-button" value="Add Place">
					<input type="button" data-id="${trip._id}" class="back-button form-button" value="Back to trips">
				</div>
			</div>
				
		`

	}
	return html;
	
}
function tripsToHtml(trips) {
	if(trips.length === 0) {
		return `
		<h4>No trips added</h4>
		`
	}
	return `
	<ul class="trip-list">
		${trips.map(function(trip, index) {
			return tripToHtml(trip);
		}).join('\n')}
	</ul>
	`
}
function placeToHtml(place, trip, isPlaceListDisplay=true) {
	let html = "";
	const options = {weekday: 'short', month: 'short', day: 'numeric'};
	if(isPlaceListDisplay) {
	html = `
	<li class="place-item">
		<div class="place-date-box">
			<i class="fa fa-calendar-o" style="font-size:24px"></i>
			<p class="place-date">${new Date(place.date).toLocaleDateString('en-US',options)}</p>
		</div>
		<div class="place-details-box">
			<span class="placename">${place.name}</span>
			<p class-"place-desc">${place.description}</p>
			<button class="edit-place-button icon-button" data-id="${place._id}" data-trip="${trip._id}"><i class="fa fa-edit fa-lg"></i></button>
			<button class="delete-place-button icon-button" data-id="${place._id}" data-trip="${trip._id}"><i class="fa fa-trash fa-lg"></i></button>
		
		</div>	
	</li>
	`
	}
	else{
		html = `

		`
	}
	return html;
}

function placesToHtml(trip){
	console.log("*************************************")
	console.log(trip);
	return trip.places && trip.places.length > 0 ? `
	<ul class="place-list">
		${trip.places.map(function(place) {
			return placeToHtml(place, trip);
		}).join('\n')}
	</ul>
	`: `<p>No places added</p>`
}

function getTrips() {
	$.ajax({
		method: 'GET',
		url: `${BASE_URL}trips`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		dataType: 'json',
		contentType: 'application/json',
		success: function(tripData) {

			showTripsSection(tripData);
		},
		error: function(err) {
			console.error(err);
		}
	})
}

function addTrip(tripData) {
	$.ajax({
		method: 'POST',
		url: `${BASE_URL}trips`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		data: JSON.stringify(tripData),
		contentType: 'application/json',
		success: function(data) {
			$('.create-trip-form')[0].reset();
			getTrips();
		},
		error: function(err) {
			console.error(err);
		}
	})	
}

function deleteTrip(tripId) {
	$.ajax({
		method: 'DELETE',
		url: `${BASE_URL}trips/${tripId}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		success: function(data) {
			getTrips();
		},
		error: function(err) {
			console.error(err);
		}
	})
}

function updateTrip(tripId, trip) {
	$.ajax({
		method: 'PUT',
		url: `${BASE_URL}trips/${tripId}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		dateType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(trip),
		success: function(data) {
			getTrips();
		},
		error: function(err) {
			console.error(err);
		}
	})
}

function getTrip(tripId) {
	$.ajax({
		method: 'GET',
		url: `${BASE_URL}trips/${tripId}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(tripData) {
			showTripDetails(tripData);
		},
		error: function(err) {
			console.error(err);
		}
	})
}
function getPlaces(tripId){
	console.log("Getting places");
	$.ajax({
		method: 'GET',
		url: `${BASE_URL}trips/${tripId}/places`,
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(user),
		success: function(places) {
			//console.log(input);
			//showLogIn();
		
		},
		error: function(err) {
			console.error(err);
		}
	})
}
function deletePlace(tripId, placeId) {
	$.ajax({
		method: 'DELETE',
		url: `${BASE_URL}trips/${tripId}/places/${placeId}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		success: function(data) {
		
			getTrip(tripId);
		},
		error: function(err) {
			console.error(err);
		}
	})
}

function addPlace(tripId, place){
	$.ajax({
		method: 'POST',
		url: `${BASE_URL}trips/${tripId}/places`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		data: JSON.stringify(place),
		contentType: 'application/json',
		success: function(trip) {
		
			getTrip(tripId);
		},
		error: function(err) {
			console.error(err);
		}
	})
}

function updatePlace(tripId, place) {
	$.ajax({
		method: 'PUT',
		url: `${BASE_URL}trips/${tripId}/places/${place.id}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		dateType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(place),
		success: function(data) {
			getTrip(tripId);
		},
		error: function(err) {
			console.error(err);
		}
	})
}

// User clicks get started button on home page
function handleGetStarted() {
	$('main').on('click', '.start-button', function(event) {
		showLogIn();
	})
}

//User clicks login on home page
function handleHomeLogin(){
	$('.nav-container').on('click','.login-button', function(event) {
	 	console.log('Login clicked');
	 	event.preventDefault();
	 	showLogIn();
	})
}
function handleLoginFormSigupLink(){
	$('main').on('click', '.create-account-link', function(event){
		showSignUp();
	})
}

function handleSignupFormLoginLink() {
	$('main').on('click', '.login-account-link', function(event){
		showLogIn();
	})
}
//User clicks sign up on home page
function handleHomeSignUp() {
	$('.nav-container').on('click','.signup-button', function(event) {
		console.log('Sign Up clicked');
		event.preventDefault();
		showSignUp();	
	})
}

//User submits the sign up form
function handleSignUpSubmission(){
 $('main').on('submit', '.signup-form', function(event) {
 	event.preventDefault();
 	console.log('Signup form submitted');
	const username = $('#username').val();
 	console.log(username);
	const password = $('#password').val();
	const firstName = $('#firstname').val();
	const lastName = $('#lastname').val();
	let user = {username, password, firstname, lastname};
	$.ajax({
		method: 'POST',
		url: `${BASE_URL}user`,
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(user),
		success: function(input) {
			console.log(input);
			showLogIn();
		},
		error: function(err) {
			console.error(err);
		}

	})
 })		

}
//User submits the login form
function handleLoginSubmission(){
	$('main').on('submit','.login-form', function(event) {
		event.preventDefault();
		console.log('Login form submitted');
		const username = $('#login-username').val();
 		console.log(username);
		const password = $('#login-password').val();
		let userInfo = {username, password}
		$.ajax({
			method: 'POST',
			url: `${BASE_URL}auth/login`,
			data: JSON.stringify(userInfo),
			contentType: 'application/json',
			success: function(data) {
				authToken = data.authToken;
				updateNavigationBar(username, true);
				getTrips();
			},
			error: function(err) {
				console.error(err);
			}
		})
	})
}

function handleUserHomeClick() {
	$('.nav-container').on('click','.home-link', function(event) {
		console.log("Home clicked");
		event.preventDefault();
		getTrips();
	})
}
function handleUserLogOutClick() {
	$('.nav-container').on('click','.logout-link', function(event) {
		console.log("Logoutclicked");
		updateNavigationBar(false);
		showLandingPage();
	})
}
//User clicks add new trip
function handleAddNewTrip(){
	$('main').on('click', '.add-trip-button',function(event) {
		showCreateTrip();
	})
}
//User creates a new trip
function handleCreatNewTrip() {
	$('main').on('submit','.create-trip-form', function(event) {
		event.preventDefault();
		const tripData = {
			name: $('.js-trip-name-entry').val(),
			startDate:  $('.js-trip-start-entry').val(),
			endDate: $('.js-trip-end-entry').val(),
			country: $('.js-trip-country-entry').val(),
			description: $('#trip-desc').val()
		}
		addTrip(tripData);
	})
}

//Display details of a trip when the user clicks a trip 
function handleDisplayTripDetails() {
	$('main').on('click', '.tripname',function(event){
		const tripId = $(this).data('id');
		console.log(tripId);
		getTrip(tripId);
		
	})
}

// Handler to delete a trip
function handleDeleteTrip() {
	$('main').on('click','.delete-trip-button', function(event) {
		console.log("Delete clicked");
		const tripId = $(this).data('id');
		deleteTrip(tripId);
	})
}

// Handler to update trip details
function handleUpdateTrip() {
	$('main').on('submit','.edit-trip-form', function(event) {
		event.preventDefault();
		console.log("Update clicked");
		const tripId = $(this).data('id');
		const toUpdateData = {
			id: tripId,
			name: $('.trip-name').val(),
			startDate: new Date($('.start-date').val()),
			endDate: new Date($('.end-date').val()),
			country: $('.country').val(),
			description: $('.description').val()
		}
		updateTrip(tripId, toUpdateData);
	})
}

// Handler to edit a trip
function handleEditTrip() {
	$('main').on('click','.edit-trip-button', function(event) {
		console.log("Edit clicked");
		const tripId = $(this).data('id');
		showTripDetailsToEdit(tripId);
	})
}

function handleAddPlaceToTrip() {
	$('main').on('click', '.add-place-button', function(event) {
		console.log("Add Place Clicked")
		const tripId = $(this).data('id');
		showAddPlace(tripId);	
	})
}
function handleCreatePlaceInfo() {
	$('main').on('submit', '.add-place-form', function(event) {
		event.preventDefault();
		console.log("Add clicked");
		const placeName = $('.js-place-name-entry').val();
		const placeDescription = $('#place-desc').val();
		
		const tripId = $(this).data('id');
		const placeData = {
			name: $('.js-place-name-entry').val(),
			date: $('.visit-date').val(),
			description: $('#place-desc').val()
		}
		$('.add-place-form')[0].reset();
		addPlace(tripId, placeData);
	})
}

// Handler to delete a place
function handleDeletePlace() {
	$('main').on('click','.delete-place-button', function(event) {
		console.log("Delete clicked");
		const placeId = $(this).data('id');
		const tripId = $(this).data('trip');
		deletePlace(tripId, placeId);
	})
} 


// Handler to edit place
function handleEditPlace() {
	$('main').on('click','.edit-place-button', function(event) {
		console.log("Edit clicked");
		const placeId = $(this).data('id');
		const tripId = $(this).data('trip');
		showPlaceDetailsToEdit(tripId, placeId);
	})
}

// Handler to update place details
function handleUpdatePlace() {
	$('main').on('submit','.edit-place-form', function(event) {
		event.preventDefault();
		console.log("Update clicked");
		const placeId = $(this).data('id');
		const tripId = $(this).data('trip');
		const toUpdateData = {
			id: placeId,
			name: $('.place-name-entry').val(),
			date: $('.form-place-date').val(),
			description: $('#place-desc').val()
		}
		updatePlace(tripId, toUpdateData);
	})
}
function formatDate(date) {
    const d = new Date(date)
    let month = `${(d.getMonth() + 1)}`;
    let day = `${d.getDate()}`;
    const year = `${d.getFullYear()}`;

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;
    return `${year}-${month}-${day}`
}

function handleCancelAddTrip(){
	$('main').on('click', '.cancel-add-trip', function(event){
		getTrips();
	})
}

function handleCancelAddPlace() {
	$('main').on('click', '.cancel-add-place', function(event){
		const tripId = $(this).data('trip');
		getTrip(tripId);
	})
}
function handleCancelEditTrip() {
	$('main').on('click', '.cancel-edit-trip', function(event) {
		getTrips();
	})
}
function handleCancelEditPlace(){
	$('main').on('click', '.cancel-edit-place', function(event){
		const tripId = $(this).data('trip');
		getTrip(tripId);
	})
}

// Handler to navigate back to trips section
function handleBackToTrips() {
	$('main').on('click', '.back-button', function(event) {
		getTrips();
	})
}
// Show trip details form to edit
function showTripDetailsToEdit(tripId) {
	$.ajax({

		method: 'GET',
		url: `${BASE_URL}trips/${tripId}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(trip) {
			const startDate = formatDate(trip.startDate);
			const endDate = formatDate(trip.endDate);
			const content = `
			<div class="edit-trip-box ">
				<form class="edit-trip-form" data-id="${trip._id}">
					<fieldset>
						<legend>Edit Trip</legend>
						<label for="tripname">Trip Name</label>
						<input type="text" name="tripname" value="${trip.name}" class="trip-name"><br>
						<label for="startdate">Start Date</label>
						<input type="date" name="startdate" value="${startDate}" class="start-date"><br>
						<label for="enddate">End Date</label>
						<input type="date" name="enddate" value="${endDate}" class="end-date"><br>
						<label for="country">Country</label>
						<input type="text" name="country" value="${trip.country}" class="country"><br>
						<p class="trip-description">
							<label for='trip-desc'>Trip Description</label>
							<textarea id="trip-desc" rows="9" cols="50" class="description">${trip.description}</textarea>
						</p>
						<input type="submit" class="update-trip-button form-button" value="Update">
						<input type="button" class="cancel-edit-trip form-button" value="Cancel">
					</fieldset>
				</form>	
			</div>
		`
		$('main').html(content);

		},
		error: function(err) {
			console.error(err);
		}
	})	

}


// Show place input form to edit
function showPlaceDetailsToEdit(tripId, placeId) {
	$.ajax({
		method: 'GET',
		url: `${BASE_URL}trips/${tripId}/places/${placeId}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(place) {
			const content = `
			<div class="edit-place-box">
				<form  data-id="${placeId}" data-trip="${tripId}" class="edit-place-form">
					<fieldset>
						<legend>Edit Place</legend>
						<label for="placename">Place Name</label>
						<input type="text" name="placename" class="place-name-entry" value="${place.name}"><br>
						<label for="date">Visited Date</label>
						<input type="date" name="date" value="${formatDate(place.date)}" class="form-place-date"><br>
						<p class="place-description">
							<label for='place-desc'>Description</label>
							<textarea id="place-desc" rows="9" cols="50">${place.description}</textarea>
						</p>
						<input type="submit" class="update-button form-button" value="Update">
						<input type="button" data-trip="${tripId}" class="cancel-edit-place form-button" value="Cancel">
			 		</fieldset>
				</form>
			</div>
		`
		$('main').html(content);
		},
		error: function(err) {
			console.error(err);
		}
	})
}

// Show sign up form
function showSignUp() {
	const content = `
	<section class="signup-section">
		<h3>Sign Up</h3>
		<form class="signup-form">
			<fieldset>
				<label for="firstname">First name</label>
				<input type="text" name="firstname" id="firstname" placeholder="First name" required><br>
				<label for="lastname">Last name</label>
				<input type="text" name="lastname" id="lastname" placeholder="Last name" required><br>
				<label for="username">Username</label>
				<input type="text" name="username" id="username" placeholder="Username" required><br>
				<label for="password">Password</label>
				<input type="password" name="password" id="password" placeholder="Password" required><br>
				<input type="submit" class="signup-form-button js-signup-button" value="Sign Up">
				<p class="login-account">Already have an account?<a href="#" class="login-account-link"> Log In</a>
			</fieldset>
		</form>		
	</section>
	`
	$('main').html(content);
}
// Show login form
function showLogIn() {
	const content = `
	<section class="login-section">
		<h3>Login</h3>
		<form class="login-form">
			<fieldset>
				<label for="username">Username</label>
				<input type="text" name="username" id="login-username" placeholder="username" required><br>
				<label for="password">Password</label>
				<input type="password" name="password" id="login-password" placeholder="password" required><br>
				<input type="submit" class="login-form-button js-login-button" value="Login">
				<p class="no-account">Don't have an account?<a href="#" class="create-account-link"> Create account</a>
				<p class="demo">For Demo:<br>username: demouser<br>password: demopassword</p>
			</fieldset>
		</form>
	</section>
	`
	$('main').html(content);

}
// Show list of trips
function showTripsSection(tripData) {
	const content = `
	<div class="outer">
		<section class="trips-section">
		<div class="my-trips">
			<h2>My trips</h2>
		</div>
		<div class="trips-container ">
		
		</div>
		<div class="trips-button-box">
			<button type="submit" class="add-trip-button form-button">Add New Trip</button>
		</div>
	</section>
	</div>
	
	`
	$('main').html(content);
	console.log("***********************");
	console.log(tripData);
	$('.trips-container').html(tripsToHtml(tripData));
}

function showPlacesSection(place) {
	const content = `
	<li class="place-item">
		<h4 class="placename">${place.name}</h4>
		<p class-"place-desc">${place.description}</p>
		<p class="place-date">${place.date}</p>
		<input type="button" value="Edit" class="edit-place-button" data-id="${place.id}" data-trip="${trip.id}">
		<input type="button" value="Delete" class="delete-place-button" data-id="${place.id}" data-trip="${trip.id}">
	</li>
	`

}
// Show form to enter trip details
function showCreateTrip() {
	const content = `
	<div class="create-trip-box">
		<form class="create-trip-form">
			<fieldset>
			<legend>Add New Trip</legend>
				<label for="tripname">Trip Name</label>
				<input type="text" name="tripname" class="js-trip-name-entry"><br>
				<label for="startdate">Start Date</label>
				<input type="date" name="startdate" class="js-trip-start-entry"><br>
				<label for="enddate">End Date</label>
				<input type="date" name="enddate" class="js-trip-end-entry"><br>
				<label for="country">Country</label>
				<input type="text" name="country" class="js-trip-country-entry"><br>
				<p class="trip-description">
					<label for='trip-desc'>Trip Description</label>
					<textarea id="trip-desc" rows="9" cols="50"></textarea>
				</p>
				<input type="submit" class="create-trip-button form-button" value="Add Trip">
				<input type="button" class="cancel-add-trip form-button" value="Cancel">
			</fieldset>
		</form>	
	</div>
	`
	$('main').html(content);
}
// Show details of a selected trip
function showTripDetails(trip) {
	const content = `	
		<section class="trip-details">
			
		</section>
	`
	$('main').html(content);
	$('.trip-details').html(tripToHtml(trip, false));	
	//$('.trip-info').html(tripToHtml(trip));
}
function showAddPlace(tripId) {
	const content = `
	<div class="add-place-box">
		<form  data-id="${tripId}" class="add-place-form">
			<fieldset>
			<legend>Add Place</legend>
			<label for="placename">Place Name</label>
			<input type="text" name="placename" class="js-place-name-entry"><br>
			<label for="date">Date Visited</label>
			<input type="date" name="date" class="visit-date"><br>			
			<p class="place-description">
				<label for='place-desc'>Description</label>
				<textarea id="place-desc" rows="9" cols="50"></textarea>
			</p>
			<input type="submit" class="add-button form-button" value="Add">
			<input type="button" data-trip="${tripId}" class="cancel-add-place form-button" value="Cancel">
			</fieldset>
		</form>
	</div>
	`
	$('main').html(content);
}

function updateNavigationBar(username, isLoggedIn) {
	const content =`
		<div class="user-box">
			<span>Hi, ${username}!</span>
			<ul class="nav-links">
				<li><a href="#" class="home-link">Home</a></li>
				<li><a href="#" class="logout-link">Logout</a></li>
			</ul>
		</div>
		
	`
	if(isLoggedIn) {
		$('.nav-container').html(content);
	}
	else{
		$('.nav-container').html(`
			<ul>
				<li><button class="login-button">Login</button></li>
				<li><button class="signup-button">Sign Up</button></li>
			</ul>
		`)
	}
}

function showLandingPage() {
	const content = `
	<div class="intro-section">
			<p>
			 Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of 
			 type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into 
			 electronic typesetting, remaining essentially unchanged. 
			</p>
			<button class="start-button">Get started</button>
		</div>	
	`
	$('main').html(content);
}

function init() {
	showLandingPage();
	handleHomeSignUp();
	handleHomeLogin();
	handleLoginFormSigupLink();
	handleSignupFormLoginLink();
	handleSignUpSubmission();
	handleLoginSubmission();
	handleUserHomeClick();
	handleUserLogOutClick();
	handleAddNewTrip();
	handleCreatNewTrip();
	handleDisplayTripDetails();
	handleAddPlaceToTrip();
	handleCreatePlaceInfo();
	handleDeleteTrip();
	handleDeletePlace();
	handleEditTrip();
	handleUpdateTrip();
	handleEditPlace();
	handleUpdatePlace();
	handleBackToTrips();
	handleCancelAddTrip();
	handleCancelEditTrip();
	handleCancelAddPlace();
	handleCancelEditPlace();
	handleGetStarted();
}
$(init());
