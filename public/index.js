const user = {
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
function tripToHtml(trip){
	return `
	<li>
		<a href="#" class="tripname">${trip.name}</a>
		<span>${trip.startDate.toLocaleDateString()} - ${trip.endDate.toLocaleDateString()} </span>
		<p class-"trip-desc">${trip.country}</p>
	</li>
	`
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

function handleHomeSignUp() {
	$('.signup-link').on('click', function(event) {
		console.log('Sign Up clicked');
		event.preventDefault();
		$('.signup-section').show();
	})
}

function handleSignUpSubmission(){

}
function handleLoginSubmission(){
	$('.js-login-button').on('click', function(event) {
		event.preventDefault();
		console.log('Login form submitted');
		$('.login-section').hide();
		$('.trips-container').html(tripsToHtml(user.trips));
		$('.trips-section').show();
	})
}

function handleCreatNewTrip() {
	$('.js-create-trip-button').on('click', function(event) {
		
	})
}
function init() {
	$('.signup-section').hide();
	$('.login-section').hide();
	$('.trips-section').hide();
	handleHomeSignUp();
	handleHomeLogin();
	handleSignUpSubmission()
	handleLoginSubmission()
}
$(init());

//console.log(tripsToHtml(user.trips));