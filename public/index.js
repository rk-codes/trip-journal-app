const user = {
	username: "user",
	password: "password",
	trips: [ {
		id: "0a",
		name: "Trip 1",
		description: "My first trip",
		startDate: new Date(2016, 12, 04),
		endDate: new Date(2016, 12, 20)	,
		country: "India",
		places: [{
			id: "00a",
			name: "Place One",
			description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
		},
		{
			id: "01a",
			name: "Place Two",
			description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
		}]
	},
	{
		id: "1a",
		name: "Trip 2",
		description: "My second trip",
		startDate: new Date(2017, 11, 04),
		endDate: new Date(2017, 11, 20),
		country: "US",
		places: [{
			id: "10a",
			name: "ertrt",
			description: "trytytu"
		}]
	},
	{
		id: "2a",
		name: "Trip 3",
		description: "My third trip",
		startDate: new Date(2017, 12, 04),
		endDate: new Date(2017, 12, 20),
		country: "Mexico",
		places: [{
			id: "20a",
			name: "ertrt",
			description: "trytytu"
		}]	
	}
	]
}
function tripToHtml(trip, isTripListDisplay=true){
	let html = "";

	if(isTripListDisplay) {
	html = `
	<li class="trip-item">
		<a class="tripname" data-id="${trip.id}">${trip.name}</a>
		<span>${trip.startDate.toLocaleDateString()} - ${trip.endDate.toLocaleDateString()} </span>
		<p class-"trip-country">${trip.country}</p>
		<input type="button" value="Edit" class="edit-trip-button" data-id="${trip.id}">
		<input type="button" value="Delete" class="delete-trip-button" data-id="${trip.id}">
	</li>
	`
	}
	else{
		console.log(trip.places);
		html = `
			<div>
				<h2>${trip.name}</h2>

				${placesToHtml(trip)}
			</div>
		`

	}
	return html;
	
}
function tripsToHtml(trips) {
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
		<input type="button" value="Edit" class="edit-place-button" data-id="${place.id}" data-trip="${trip.id}">
		<input type="button" value="Delete" class="delete-place-button" data-id="${place.id}" data-trip="${trip.id}">
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
	
	return trip.places && trip.places.length > 0 ? `
	<ul class="place-list">
		${trip.places.map(function(place) {
			return placeToHtml(place, trip);
		}).join('\n')}
	</ul>
	`: `<span>No places to display</span>`
}

//User clicks login on home page
function handleHomeLogin(){
	$('.login-link').on('click', function(event) {
	 	console.log('Login clicked');
	 	event.preventDefault();
	 	showLogIn();
	 	//$('.trips-container').html(tripsToHtml(user.trips));
	 	//$('.trips-section').show();
	})
	// 	$('.triplist').html(tripsToHtml());
	// })
	$('.trips-container').html(tripsToHtml(user.trips));
}

//User clicks sign up on home page
function handleHomeSignUp() {
	$('.signup-link').on('click', function(event) {
		console.log('Sign Up clicked');
		event.preventDefault();
		showSignUp();
	})
}

//User submits the sign up form
function handleSignUpSubmission(){

}
//User submits the login form
function handleLoginSubmission(){
	$('main').on('submit','.login-form', function(event) {
		event.preventDefault();
		console.log('Login form submitted');
		$('.nav-container').html(`
			<span>Hi, user!</span>
			<ul class="nav-links">
				<li><a href="#" class="home-link">Home</a></li>
				<li><a href="#" class="logout-link">Logout</a></li>
			</ul>
		`);
		showTripsSection();
		
	})
}
function handleUserHomeClick() {
	$('.nav-container').on('click','.home-link', function(event) {
		console.log("Home clicked");
		event.preventDefault();
		showTripsSection();
	})
}
function handleUserLogOutClick() {
	$('.nav-container').on('click','.logout-link', function(event) {
		console.log("Logoutclicked");
		event.preventDefault();
		showLogIn();
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
	
		const tripName = $('.js-trip-name-entry').val();
		const tripStartDate = $('.js-trip-start-entry').val();
		const tripEndDate = $('.js-trip-end-entry').val();
		const tripCountry = $('.js-trip-country-entry').val();
		const tripdescription = $('#trip-desc').val();
		addTripToUser(tripName, tripStartDate, tripEndDate, tripCountry, tripdescription);
		$('.create-trip-form')[0].reset();
		showTripsSection();	
		console.log(`${tripName}, ${tripStartDate}, ${tripEndDate}, ${tripCountry}, ${tripdescription}`);

	})
}
//Add the user entered trip details to the user object
function addTripToUser(tripName, tripStartDate, tripEndDate, tripCountry, tripdescription) {
	const newTrip = {
		id: generateId(),
		name: tripName,
		description: tripdescription,
		startDate: new Date(tripStartDate),
		endDate: new Date(tripEndDate),
		country: tripCountry
	}
	user.trips.push(newTrip);
	console.log(user.trips);
	
}
//Display details of a trip when the user clicks a trip 
function handleDisplayTripDetails() {
	$('main').on('click', '.tripname',function(event){
		const tripId = $(this).data('id');
		const trip = user.trips.find(function(trip) {return trip.id === tripId});
		if(trip) {
			displayTripDetails(trip);
		} else {
			// TODO:Error message
		}
		
	})
}
function displayTripDetails(trip) {
	showTripDetails(trip);
	
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
		console.log("Add clicked");
		const placeName = $('.js-place-name-entry').val();
		const placeDescription = $('#place-desc').val();
		$('.add-place-form')[0].reset();
		const tripId = $(this).data('id');
		const trip = user.trips.find(function(trip) {return trip.id === tripId});
		addPlaceToTrip(trip, placeName, placeDescription);
		showTripDetails(trip);
	})
}

function addPlaceToTrip(trip, placeName, placeDesc) {
	const newPlace = {
		id: generateId(),
		name: placeName,
		description: placeDesc
	}
	trip.places.push(newPlace);

}
// Handler to delete a trip
function handleDeleteTrip() {
	$('main').on('click','.delete-trip-button', function(event) {
		console.log("Delete clicked");
		const tripId = $(this).data('id');
		const trip = user.trips.find(function(trip) {return trip.id === tripId});
		const index = user.trips.indexOf(trip);
		if(index >= 0) {
			user.trips.splice(index, 1);
		}
		showTripsSection();
	})
}
// Handler to delete a place
function handleDeletePlace() {
	$('main').on('click','.delete-place-button', function(event) {
		console.log("Delete clicked");
		const placeId = $(this).data('id');
		const tripId = $(this).data('trip');
		const trip = user.trips.find(function(trip) {return trip.id === tripId});
		const place = trip.places.find(function(place) {return place.id === placeId});
		const index = trip.places.indexOf(place);
		console.log(`TripId: ${tripId} PlaceId: ${placeId} TripPlace: ${trip.places[0].id} Place: ${place}, Index: ${index}`);
		console.log(placeId);
		console.log(tripId);
		console.log(trip.places[0].id);
		if(index >= 0) {
			trip.places.splice(index, 1);
		}
		showTripDetails(trip);
	})
} 

// Handler to edit a trip
function handleEditTrip() {
	$('main').on('click','.edit-trip-button', function(event) {
		console.log("Edit clicked");
		const tripId = $(this).data('id');
		const trip = user.trips.find(function(trip) {return trip.id === tripId});
		showTripDetailsToEdit(trip);
	})
}
// Show trip details form to edit
function showTripDetailsToEdit(trip) {
	console.log(trip.startDate.toLocaleDateString());
	console.log(trip.endDate.toLocaleDateString());
	let start = trip.startDate;
	let sday = ("0" + start.getDate()).slice(-2);
	let smonth = ("0" + (start.getMonth() + 1)).slice(-2);
	let startDate = start.getFullYear()+"-"+(smonth)+"-"+(sday);
	let end = trip.endDate;
	let eday = ("0" + end.getDate()).slice(-2);
	let emonth = ("0" + (end.getMonth() + 1)).slice(-2);
	let endDate = end.getFullYear()+"-"+(emonth)+"-"+(eday);

	const content = `
		<form action="#" class="edit-trip-form" data-id="${trip.id}">
				<h2>Edit Trip</h2>
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
		</form>	
	`
	$('main').html(content);

}
// Handler to update trip details
function handleUpdateTrip() {
	$('main').on('submit','.edit-trip-form', function(event) {
		console.log("Update clicked");
		const tripId = $(this).data('id');
		const trip = user.trips.find(function(trip) {return trip.id === tripId});
		trip.name = $('.trip-name').val();
		trip.startDate = new Date($('.start-date').val());
		trip.endDate = new Date($('.end-date').val());
		trip.country = $('.country').val();
		trip.description = $('.description').val();
		console.log("Start:" + trip.startDate.toString());
		showTripsSection();
	})
}

// Handler to edit place
function handleEditPlace() {
	$('main').on('click','.edit-place-button', function(event) {
		console.log("Edit clicked");
		const placeId = $(this).data('id');
		const tripId = $(this).data('trip');
		const trip = user.trips.find(function(trip) {return trip.id === tripId});
		const place = trip.places.find(function(place) {return place.id === placeId});
		showPlaceDetailsToEdit(trip, place);
	})
}
// Show place input form to edit
function showPlaceDetailsToEdit(trip, place) {
	const content = `
	<form action="#" data-id="${place.id}" data-trip="${trip.id}" class="edit-place-form">
		<h2>Edit Place</h2>
		<label for="placename">Place Name</label>
		<input type="text" name="placename" class="place-name-entry" value="${place.name}"><br>
		<p class="place-description">
			<label for='place-desc'>Description</label>
			<textarea id="place-desc" rows="9" cols="50">${place.description}</textarea>
		</p>
		<input type="submit" class="update-button js-update-button" value="Update">
	</form>
	`
	$('main').html(content);
}
// Handler to update place details
function handleUpdatePlace() {
	$('main').on('submit','.edit-place-form', function(event) {
		console.log("Update clicked");
		const placeId = $(this).data('id');
		const tripId = $(this).data('trip');
		const trip = user.trips.find(function(trip) {return trip.id === tripId});
		const place = trip.places.find(function(place) {return place.id === placeId});
		place.name = $('.place-name-entry').val();
		place.description = $('#place-desc').val();
		showTripDetails(trip);
	})
}
// Handler to navigate back to trips section
function handleBackToTrips() {
	$('main').on('click', '.back-button', function(event) {
		showTripsSection();
	})
}
// Show sign up form
function showSignUp() {
	const content = `
	<section class="signup-section">
			<form action="#" class="signup-form">
				<h2>Sign Up</h2>
				<label for="email">Email</label>
				<input type="email" name="email"><br>
				<label for="username">Username</label>
				<input type="text" name="username"><br>
				<label for="password">Password</label>
				<input type="password" name="password"><br>
				<input type="submit" class="signup-button js-signup-button" value="Sign Up">
			</form>		
		</section>
	`
	$('main').html(content);
}
// Show login form
function showLogIn() {
	const content = `
	<section class="login-section">
			<form action="#" class="login-form">
				<h2>Login</h2>
				<label for="username">Username</label>
				<input type="text" name="username"><br>
				<label for="password">Password</label>
				<input type="password" name="password"><br>
				<input type="submit" class="login-button js-login-button" value="Login">
			</form>
		</section>
	`
	$('main').html(content);

}
// Show list of trips
function showTripsSection() {
	const content = `
	<section class="trips-section">
			<h2>My trips</h2>
			<div class="trips-container">
		
			</div>
			<button type="submit" class="add-trip-button">Add New Trip</button>
		</section>
	`
	$('main').html(content);
	$('.trips-container').html(tripsToHtml(user.trips));
}
// Show form to enter trip details
function showCreateTrip() {
	const content = `
	<section class="create-trip-section"> 
			<form action="#" class="create-trip-form">
				<h2>Create Trip</h2>
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
				<input type="submit" class="create-trip-button js-create-trip-button" value="Create Trip">
			</form>	
		
		</section>
	`
	$('main').html(content);
}
// Show details of a selected trip
function showTripDetails(trip) {
	const content = `	
		<section class="trip-details">
			<div class="trip-info">
			</div>
			<div class="trip-places-list">
			</div>
			<input type="button" data-id="${trip.id}" class="add-place-button" value="Add Place">
			<input type="button" data-id="${trip.id}" class="back-button" value="Back">
		</section>
	`
	$('main').html(content);
	$('.trip-places-list').html(tripToHtml(trip, false));	
	//$('.trip-info').html(tripToHtml(trip));
}
function showAddPlace(tripId) {
	const content = `
	<form action="#" data-id="${tripId}" class="add-place-form">
		<label for="placename">Place Name</label>
		<input type="text" name="placename" class="js-place-name-entry"><br>
		<p class="place-description">
			<label for='place-desc'>Description</label>
			<textarea id="place-desc" rows="9" cols="50"></textarea>
		</p>
		<input type="submit" class="add-button js-add-button" value="Add">
	</form>
	`
	$('main').html(content);
}

function generateId() {
	return `${Math.random().toString(36).substring(2, 15)}${ Math.random().toString(36).substring(2, 15)}`
}
function init() {
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
}
$(init());
