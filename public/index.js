const user = {
	username: "user",
	password: "password",
	trips: [ {
		name: "Trip 1",
		description: "My first trip",
		startDate: new Date(2016, 12, 04),
		endDate: new Date(2016, 12, 20)	,
		country: "India",
		places: [{
			name: "ertrt",
			description: "trytytu"
		}]
	},
	{
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
		<a class="tripname">${trip.name}</a>
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
		${trips.map(function(trip) {
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
	return `
	<ul class="place-list">
		${places.map(function(place) {
			return placeToHtml(place);
		}).join('\n')}
	</ul>
	`
}
//User clicks login on home page
function handleHomeLogin(){
	$('.login-link').on('click', function(event) {
	 	console.log('Login clicked');
	 	event.preventDefault();
	 	$('.login-section').show();
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
		$('.signup-section').show();
	})
}

//User submits the sign up form
function handleSignUpSubmission(){

}
//User submits the login form
function handleLoginSubmission(){
	$('.js-login-button').on('click', function(event) {
		event.preventDefault();
		console.log('Login form submitted');
		$('.login-section').hide();
		$('.intro-section').hide();
		$('.trips-container').html(tripsToHtml(user.trips));
		$('.trips-section').show();
	})
}

//User clicks add new trip
function handleAddNewTrip(){
	$('.add-trip-button').on('click', function(event) {
		$('.trips-section').hide();
		$('.create-trip-section').show();
	})
}
//User creates a new trip
function handleCreatNewTrip() {
	$('.js-create-trip-button').on('click', function(event) {
		$('.intro-section').hide();	
		const tripName = $('.js-trip-name-entry').val();
		const tripStartDate = $('.js-trip-start-entry').val();
		const tripEndDate = $('.js-trip-end-entry').val();
		const tripCountry = $('.js-trip-country-entry').val();
		const tripdescription = $('#trip-desc').val();
		addTripToUser(tripName, tripStartDate, tripEndDate, tripCountry, tripdescription);

		$('.create-trip-section').hide();

		$('.trips-container').html(tripsToHtml(user.trips));
		$('.trips-section').show();

		console.log(`${tripName}, ${tripStartDate}, ${tripEndDate}, ${tripCountry}, ${tripdescription}`);

	})
}
//Add the user entered trip details to the user object
function addTripToUser(tripName, tripStartDate, tripEndDate, tripCountry, tripdescription) {
	const newTrip = {
		name: tripName,
		description: tripdescription,
		startDate: new Date(tripStartDate),
		endDate: new Date(tripEndDate),
		country: tripCountry
	}
	user.trips.push(newTrip);
	console.log(user.trips);
	
}
function handleDisplayTripDetails() {
	$('main').on('click', '.tripname',function(event){
		const tripName = $(this).text();
		console.log(`Trip Clicked : ${tripName}`);
		displayTripDetails(tripName);
	})
}
function displayTripDetails(tripName) {
	tripToHtml(tripName, false);
}
function init() {
	$('.signup-section').hide();
	$('.login-section').hide();
	$('.trips-section').hide();
	$('.create-trip-section').hide();
	handleHomeSignUp();
	handleHomeLogin();
	handleSignUpSubmission();
	handleLoginSubmission();
	handleAddNewTrip();
	handleCreatNewTrip();
	handleDisplayTripDetails();
}
$(init());

//console.log(tripsToHtml(user.trips));