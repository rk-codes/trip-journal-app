const user = {
	username: "user",
	password: "password",
	trips: [ {
		id: 0,
		name: "Trip 1",
		description: "My first trip",
		startDate: new Date(2016, 12, 04),
		endDate: new Date(2016, 12, 20)	,
		country: "India",
		places: [{
			name: "Place One",
			description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
		},
		{
			name: "Place Two",
			description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
		}]
	},
	{
		id: 1,
		name: "Trip 2",
		description: "My second trip",
		startDate: new Date(2017, 11, 04),
		endDate: new Date(2017, 11, 20),
		country: "US",
		places: [{
			name: "ertrt",
			description: "trytytu"
		}]
	},
	{
		id: 2,
		name: "Trip 3",
		description: "My third trip",
		startDate: new Date(2017, 12, 04),
		endDate: new Date(2017, 12, 20),
		country: "Mexico",
		places: [{
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
		<p class-"trip-desc">${trip.country}</p>
	</li>
	`
	}
	else{
		console.log(trip.places);
		html = `
			<div>
				<h2>${trip.name}</h2>

				${placesToHtml(trip.places)}
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
function placeToHtml(place, isPlaceListDisplay=true) {
	let html = "";
	if(isPlaceListDisplay) {
	html = `
	<li class="place-item">
		<a class="placename">${place.name}</a>
		<p class-"place-desc">${place.description}</p>
	</li>
	`
	}
	else{
		html = `

		`
	}
	return html;
}

function placesToHtml(places){
	console.log(`placesToHtml() - ${places}`);
	return places && places.length > 0 ? `
	<ul class="place-list">
		${places.map(function(place) {
			return placeToHtml(place);
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
		showTripsSection();
		
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
		id: user.trips.length,
		name: tripName,
		description: tripdescription,
		startDate: new Date(tripStartDate),
		endDate: new Date(tripEndDate),
		country: tripCountry
	}
	user.trips.push(newTrip);
	console.log(user.trips);
	
}
//Display details of a trip when the user clicks a trip name
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
	showTripDetails();
	$('.trip-places-list').html(tripToHtml(trip, false));
	

}

function handleAddPlaceToTrip() {
	$('.add-place-button').on('click', function(event) {

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
				<p class="trip-desciption">
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
function showTripDetails() {
	const content = `	
		<section class="trip-details">
			<div class="trip-places-list">
			</div>
			<input type="button" class="add-place-button" value="Add Place">
		</section>
	`
	$('main').html(content);

}

function init() {
	handleHomeSignUp();
	handleHomeLogin();
	handleSignUpSubmission();
	handleLoginSubmission();
	handleAddNewTrip();
	handleCreatNewTrip();
	handleDisplayTripDetails();
}
$(init());
