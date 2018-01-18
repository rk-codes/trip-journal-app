const express = require('express');
const app = express();
const passport = require('passport');

const { DATABASE_URL, PORT } = require('./config');
const {router: tripRouter} = require('./trip');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Trip} = require('./trip');
const {User} = require('./user');
const {Place} = require('./place');

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
app.get('/trips/', jwtAuth, (req, res) => {

	if(req.user) {
		console.log(req.user.id);
		User.findByUserName(req.user.username).populate({path: 'trips'}).then(function(user) {
			console.log(user.username);
			console.log(user.trips.length); 
			res.json(user.trips.map(trip => trip));
		})
   
    	.catch(err => {
     		 console.error(err);
      		res.status(500).json({ error: 'Internal Server Error' });
    	});
	} else {
	res.status(400).json({error: 'No logged in user'})
	}	
	
})

app.get('/trips/:id/places', jwtAuth, (req, res) => {
	Trip.findById(req.params.id).populate({path: 'places'})
	.then(trip => res.json(trip.places))
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Internal Server Error'});
	});
})

app.get('/trips/:tripid/places/:placeid',jwtAuth, (req, res) => {
	Place.findById(req.params.placeid)
	.then(place => {
		console.log(place.trip);
		console.log(req.params.tripid);
		if(place.trip === req.params.tripid) {
			res.json(place)
		} else{
			res.status(400).json("Trip does'nt contain the place");
		}
	})
} )
// GET a trip by id
app.get('/trips/:id', jwtAuth, (req, res) => {
	//Trip.findById(req.params.id)
	Trip.findById(req.params.id)
	.then(trip =>res.json(trip))
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Internal Server Error'});
	});
})

// DELETE a trip
// app.delete('/trips/:id', jwtAuth, (req, res) => {

//   Trip
//     .findByIdAndRemove(req.params.id)
//     .then(trip => res.status(204).end())
//     .catch(err => res.status(500).json({ message: 'Internal server error' }));
// });

app.delete('/trips/:id', jwtAuth, function(req, res)  {

	Trip.findByIdAndRemove(req.params.id)
	.then(function(trip) {
		if(trip) {
			console.log(trip);
			User.findByIdAndUpdate({_id: trip.user},
				{ $pull: {trips: req.params.id} }, function(err, data) {
					if(err) {
						console.log(err);
        				return res.send(err);
					}
				return res.json(trip);
			})
		} else {
			 return res.send("No trip found");
		}
       
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	})

})


// POST new trip
app.post('/trips/', jsonParser, jwtAuth, (req, res) => {

console.log(req.user);
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
		user: req.user.id,
		name: req.body.name,
		description: req.body.description,
		startDate: req.body.startDate,
		endDate: req.body.endDate,
		country: req.body.country 
	})
	.then(function(trip) {
		User.findByIdAndUpdate(req.user.id, 
			{ $push: {"trips": trip} },
			{  safe: true, upsert: true},
       		function(err, model) {
         		if(err){
        			console.log(err);
        			return res.send(err);
        		 }
        	return res.json(trip.serialize());
		});

	})
	.catch(err => {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	})
	
})

app.put('/trips/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['name', 'description', 'startDate', 'endDate', 'country'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Trip
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(trip => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

app.post('/trips/:id/places', jwtAuth, jsonParser, (req, res) => {
	const requiredFields = ['name', 'description'];
	for (let i = 0; i < requiredFields.length; i++) {
    	const field = requiredFields[i];
    	if (!(field in req.body)) {
      		const message = `Missing \`${field}\` in request body`;
      		console.error(message);
      		return res.status(400).send(message);
    	}
  	}
  	Place.create({
  		trip: mongoose.Schema.Types.ObjectId(req.params.id),
  		name: req.body.name,
  		description: req.body.description
  	})
  	.then(function(place) {
  		Trip.findByIdAndUpdate(req.params.id,
  			{ $push: {"places": place} },
			{  safe: true, upsert: true},
			function(err, model) {
         		if(err){
        			console.log(err);
        			return res.send(err);
        		 }
        	return res.json(place.serialize());
  			})
		})
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