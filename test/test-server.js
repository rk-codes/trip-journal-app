const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const jwt = require('jsonwebtoken');

const should = chai.should();

const {app, closeServer, runServer} = require('../server');
const {Trip} = require('../trip/models');
const {User} = require('../user/models');
const {Place} = require('../place/models');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');

chai.use(chaiHttp);


let newTestUser = {
	'username': 'exampleUser',
	'password': 'examplePass',
	'firstname': 'First',
	'lastname': 'Last'
}

let testUser = 'demouser';
let testPassword = 'demopassword';
let authToken;


function generateToken(){
	const username = 'exampleUser';
	const password = 'examplePass';
	const firstName = 'First';
	const lastName = 'Last';

	const token = jwt.sign(
			{
				user: {	username,
						firstName,
						lastName},
			},
				JWT_SECRET,
			{
				algorithm: 'HS256',
				subject: username,
				expiresIn: '7d'
			}
		);
	return token;
}

function seedTripData(userId) {
	console.info("seeding trip data");
	const seedData = [];
	for (let i=1; i<=10; i++) {
		//seedData.push(generateTripData(userId));
	}
  	// this will return a promise
  	//return Trip.insertMany(seedData);

  	return Trip.create(generateTripData(userId))
  	.then(function(trip) {
  		User.findByIdAndUpdate(userId, 
  			{ $push: {"trips": trip} },
			{  safe: true, upsert: true},
       		function(err, model) {
         		if(err){
        			console.log(err);
        			return ;
        		 }
        	return ;
		})
  	})
}

function generateTestUser() {
	console.info("generateTestUser");
	// return {
	// 	username: 'exampleUser',
	// 	password: 'examplePass',
	// 	firstName: 'First',
	// 	lastName: 'Last',
	// 	trips: [generateTripData()]
	// }
	return User.create({

		username: 'exampleUser',
		password: 'examplePass',
		firstName: 'First',
		lastName: 'Last'
		//trips: [mongoose.Schema.Types.ObjectId("123")]
	})
}

function generateTripData(userId) {
	return {
		user: [mongoose.Types.ObjectId(userId)],
		name: faker.Lorem.sentence(),
		description: faker.Lorem.paragraph(),
		startDate: new Date(2016, 12, 04),
		endDate: new Date(2016, 12, 20),
		country: faker.random.uk_country()
		//places: [generatePlaceData(), generatePlaceData()] 
	}
}

function generatePlaceData(tripId) {
	return {
		name: faker.lorem.word(),
		description: faker.lorem.paragraph(),
		trip: mongoose.Types.ObjectId(tripId)
	}
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Trip test API resources', function() {
		let testUser;
		let newUserId;
		let tripId;
		before(function() {
	    	return runServer(TEST_DATABASE_URL);
	  	});

		after(function() {
		 	return closeServer();
	  	});
		
		it('should register new user', function() {
			return chai.request(app)
			.post('/user/')
			.send(newTestUser)
			.then(function (res) {
				res.should.have.status(201);
				return User.findByUserName(res.body.username);
					
			})
			.then(function(user) {
				console.log(user._id);
				newUserId = user._id;
				//Trip.create(generateTripData(newUserId));
			})
			.catch((err) => {
	            console.log(err)
	        });
		});


		// it('should login registered user', function() {
		
		// 	return chai.request(app)
		// 	.post('/auth/login')
		// 	.send({name: 'demouser', password: 'demopassword'})
		// 	.then(function(res) {
		// 		res.should.have.status(200);
		// 		authToken = res.body.authToken;
		// 		console.log(authToken);
		// 	})
		// 	.catch((err) => {
  //               console.log(err)
  //           });
		// })
	

 	describe('Trips', function() {
 		beforeEach(function() {
 		//generateTestUser();
    		return seedTripData(newUserId);
  		});

  		afterEach(function() {
    		return tearDownDb();
  		});

		it('should return all trips on GET', function() {
			const token = generateToken();
			//seedTripData();
			return chai.request(app)
			.get('/trips')
			.set('authorization', `Bearer ${token}`)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.have.length.of.at.least(1);
				res.body.forEach(function(trip) {
					trip.should.be.a('object');
					trip.should.include.keys('name', 'description', 'startDate', 'endDate', 'country', 'places');
				});
				tripId = res.body[0]._id;
				console.log(tripId);
			})
			.catch((err) => {
                console.log(err)
            });
		});

		// it('should return one trip on GET by id', function() {
		// 	const token = generateToken();
		// 	//seedTripData();
		// 	return chai.request(app)
		// 	.get(`/trips/${tripId}`)
		// 	.set('authorization', `Bearer ${token}`)
		// 	.then(function(res) {
		// 		res.should.have.status(200);
		// 		res.should.be.json;
		// 		res.body.should.be.a('object');
		// 		//res.body.id.should.equal(tripId);
		// 		// res.body.forEach(function(trip) {
		// 		// 	trip.should.be.a('object');
		// 		// 	trip.should.include.keys('name', 'description', 'startDate', 'endDate', 'country', 'places');
		// 		// });
		// 	});
		// })

		it('should delete one trip by id', function() {
			const token = generateToken();
			return chai.request(app)
			.delete(`/trips/${tripId}`)
			.set('authorization', `Bearer ${token}`)
			.then(function(res) {
				res.should.have.status(200);
				return Trip.findById(tripId)
			})
			.then(function(_trip){
				should.not.exist(_trip);
			});
		});

		it('should post a new trip', function() {
			const token = generateToken();
			let newTrip = generateTripData(newUserId);
			return chai.request(app)
			.post('/trips/')
			.set('authorization', `Bearer ${token}`)
			.send(newTrip)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('name', 'description', 'startDate', 'endDate', 'country', 'places');
				res.body.name.should.equal(newTrip.name);
				res.body.description.should.equal(newTrip.description);
				// res.body.startDate.should.equal(newTrip.startDate);
				// res.body.endDate.should.equal(newTrip.endDate);
				res.body.country.should.equal(newTrip.country);
			});
		});

		it('should update a trip', function() {
			const token = generateToken();
			const updateData = {
				name: "Trip One",
				country: "USA"
			}
			return Trip.findOne()
			.then(function(trip) {
				updateData.id = trip.id;
				return chai.request(app)
				.put(`/trips/${trip.id}`)
				.set('authorization', `Bearer ${token}`)
				.send(updateData)
			})
			.then(function(res) {
				res.should.have.status(200);
				return Trip.findById(updateData.id)
			})
			.then(function(trip) {
				trip.name.should.equal(updateData.name);
				trip.country.should.equal(updateData.country);
			});
		});

	})
})

// 
