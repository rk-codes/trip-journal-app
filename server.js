const express = require('express');
const app = express();
const passport = require('passport');

const { DATABASE_URL, PORT } = require('./config');
const {router: tripRouter} = require('./trip');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Trip} = require('./trip/models');
const {User} = require('./user/models');

const { router: userRouter } = require('./user');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const jwtAuth = passport.authenticate('jwt', { session: false });

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(express.static('public'));

passport.use(localStrategy);
passport.use(jwtStrategy);


app.use('/user/', userRouter);
app.use('/auth/', authRouter);

// GET trips
app.get('/trips', jwtAuth, (req, res) => {

	if(req.user) {
		// req.user.populate({path: 'trips', populate: {path: 'places'}}) .then(function(user) {
		// res.json(user.trips.map(trip => trip.serialize()));
    
		// })
		User.findByUserName(req.user.username).populate({path: 'trips'}).then(function(user) {
			console.log(user.trips.length);
			res.json(user.trips.map(trip => trip.serialize()));
		})
   
    	.catch(err => {
     		 console.error(err);
      		res.status(500).json({ error: 'Internal Server Error' });
    	});
	} else {
	res.status(400).json({error: 'No logged in user'})
	}	
	
})

// GET a trip by id
app.get('/trips/:id', jwtAuth, (req, res) => {
	//Trip.findById(req.params.id)
	Trip.findById(req.params.id)
	.then(trip =>res.json(trip.serialize()))
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Internal Server Error'});
	});
})

// DELETE a trip
app.delete('/trips/:id', jwtAuth, (req, res) => {
  Trip
    .findByIdAndRemove(req.params.id)
    .then(restaurant => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});



app.post('/trips', jsonParser, jwtAuth, (req, res) => {
	const requiredFields = ['name', 'description', 'startDate', 'endDate', 'country'];
	for (let i = 0; i < requiredFields.length; i++) {
    	const field = requiredFields[i];
    	if (!(field in req.body)) {
      		const message = `Missing \`${field}\` in request body`;
      		console.error(message);
      		return res.status(400).send(message);
    	}
  	}
	Trip.create({
		name: req.body.name,
		description: req.body.description,
		startDate: req.body.startDate,
		endDate: req.body.endDate,
		country: req.body.country
		
	})
	.then(trip => res.status(201).json(trip.serialize()))
	.catch(err => {
		console.error(err);
    	res.status(500).json({ error: 'Internal Server Error' });
	});
})

//app.use('/trip/', tripRouter);

let server;


// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. 
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

//app.listen(process.env.PORT || 8080);
module.exports = { runServer, app, closeServer };