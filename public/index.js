const BASE_URL = 'http://localhost:8080/';
let authToken;

function tripToHtml(trip, isTripListDisplay=true){
	//console.log(trip.id);
	let html = "";

	if(isTripListDisplay) {
	html = `
	<li class="trip-item">
		<a class="tripname" data-id="${trip.id}">${trip.name}</a>
		<span>${formatDate(trip.startDate)}  to ${formatDate(trip.endDate)} </span>
		<p class-"trip-country">${trip.country}</p>
		<input type="button" value="Edit" class="edit-trip-button" data-id="${trip.id}">
		<input type="button" value="Delete" class="delete-trip-button" data-id="${trip.id}">
	</li>
	`
	}
	else{
		//console.log(trip.places);
		html = `
			<div class="trip-info">
				<h3>${trip.name}</h3>
				<div class="trip-date">
					<span>${formatDate(trip.startDate)} to ${formatDate(trip.endDate)}</span>
				</div>
				<p>${trip.description}</h2>
			</div>
				<div class="places-container"
					${placesToHtml(trip)}
				</div>
				<input type="button" data-id="${trip._id}" class="add-place-button" value="Add Place">
				<input type="button" data-id="${trip._id}" class="back-button" value="Back to trips">
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
	if(isPlaceListDisplay) {
	html = `
	<li class="place-item">
		<h4 class="placename">${place.name}</h4>
		<p class-"place-desc">${place.description}</p>
		<input type="button" value="Edit" class="edit-place-button" data-id="${place._id}" data-trip="${trip._id}">
		<input type="button" value="Delete" class="delete-place-button" data-id="${place._id}" data-trip="${trip._id}">
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
	//console.log("Getting trips");
	$.ajax({
		method: 'GET',
		url: `${BASE_URL}trips`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		dataType: 'json',
		contentType: 'application/json',
		success: function(tripData) {
			//console.log(input);
			//showLogIn();
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
			//showTripsSection(data); TODO
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
			//showTripDetails(trip); TODO
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

//User clicks login on home page
function handleHomeLogin(){
	$('.login-button').on('click', function(event) {
	 	console.log('Login clicked');
	 	event.preventDefault();
	 	showLogIn();
	})
}

//User clicks sign up on home page
function handleHomeSignUp() {
	$('.signup-button').on('click', function(event) {
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
				//showTripsSection();
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
		//const trip = user.trips.find(function(trip) {return trip.id === tripId});
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
		// const trip = user.trips.find(function(trip) {return trip.id === tripId});
		// const place = trip.places.find(function(place) {return place.id === placeId});
		// const index = trip.places.indexOf(place);
		// console.log(`TripId: ${tripId} PlaceId: ${placeId} TripPlace: ${trip.places[0].id} Place: ${place}, Index: ${index}`);
		// console.log(placeId);
		// console.log(tripId);
		// console.log(trip.places[0].id);
		// if(index >= 0) {
		// 	trip.places.splice(index, 1);
		// }
		// showTripDetails(trip);
		deletePlace(tripId, placeId);
	})
} 


// Handler to edit place
function handleEditPlace() {
	$('main').on('click','.edit-place-button', function(event) {
		console.log("Edit clicked");
		const placeId = $(this).data('id');
		const tripId = $(this).data('trip');
		//const trip = user.trips.find(function(trip) {return trip.id === tripId});
		//const place = trip.places.find(function(place) {return place.id === placeId});
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
		//const trip = user.trips.find(function(trip) {return trip.id === tripId});
		//const place = trip.places.find(function(place) {return place.id === placeId});
		const toUpdateData = {
			id: placeId,
			name: $('.place-name-entry').val(),
			description: $('#place-desc').val()
		}
		//place.name = $('.place-name-entry').val();
		//place.description = $('#place-desc').val();
		//showTripDetails(trip);
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
	// console.log(trip.startDate.toLocaleDateString());
	// console.log(trip.endDate.toLocaleDateString());
	// let start = trip.startDate;
	// let sday = ("0" + start.getDate()).slice(-2);
	// let smonth = ("0" + (start.getMonth() + 1)).slice(-2);
	// let startDate = start.getFullYear()+"-"+(smonth)+"-"+(sday);
	// let end = trip.endDate;
	// let eday = ("0" + end.getDate()).slice(-2);
	// let emonth = ("0" + (end.getMonth() + 1)).slice(-2);
	// let endDate = end.getFullYear()+"-"+(emonth)+"-"+(eday);	

	$.ajax({

		method: 'GET',
		url: `${BASE_URL}trips/${tripId}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(trip) {
			//showTripDetails(tripData);
			const startDate = formatDate(trip.startDate);
			const endDate = formatDate(trip.endDate);
			const content = `
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
				<input type="submit" class="update-trip-button" value="Update">
			</fieldset>
		</form>	
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
		<form  data-id="${placeId}" data-trip="${tripId}" class="edit-place-form">
			<fieldset>
				<legend>Edit Place</legend>
				<label for="placename">Place Name</label>
				<input type="text" name="placename" class="place-name-entry" value="${place.name}"><br>
				<p class="place-description">
					<label for='place-desc'>Description</label>
					<textarea id="place-desc" rows="9" cols="50">${place.description}</textarea>
				</p>
				<input type="submit" class="update-button js-update-button" value="Update">
				<input type="button" data-trip="${tripId}" class="cancel-edit-place" value="Cancel">
			 </fieldset>
		</form>
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
	<section class="trips-section">
		<h2>My trips</h2>
		<div class="trips-container ">
		
		</div>
		<button type="submit" class="add-trip-button">Add New Trip</button>
	</section>
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
		<input type="button" value="Edit" class="edit-place-button" data-id="${place.id}" data-trip="${trip.id}">
		<input type="button" value="Delete" class="delete-place-button" data-id="${place.id}" data-trip="${trip.id}">
	</li>
	`

}
// Show form to enter trip details
function showCreateTrip() {
	const content = `
	<section class="create-trip-section">
		<h3>Add New Trip</h3> 
		<form class="create-trip-form">
			<fieldset>
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
				<input type="submit" class="create-trip-button js-create-trip-button" value="Add Trip">
				<input type="button" class="cancel-add-trip" value="Cancel">
			</fieldset>
		</form>	
	</section>
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
	<form  data-id="${tripId}" class="add-place-form">
		<label for="placename">Place Name</label>
		<input type="text" name="placename" class="js-place-name-entry"><br>
		<p class="place-description">
			<label for='place-desc'>Description</label>
			<textarea id="place-desc" rows="9" cols="50"></textarea>
		</p>
		<input type="submit" class="add-button js-add-button" value="Add">
		<input type="button" data-trip="${tripId}" class="cancel-add-place" value="Cancel">
	</form>
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
	<div class="intro-section row">
			<p>
			Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
			when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into 
			electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
			and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
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
	handleCancelAddPlace();
	handleCancelEditPlace();
}
$(init());
