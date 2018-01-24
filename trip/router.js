const express = require('express');
const config = require('../config');
const mongoose = require('mongoose');
const router = express.Router();

const {User} = require('../user/models');
const {Trip} = require('./models');
const {Place} = require('../place/models');

const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
const jwtAuth = passport.authenticate('jwt', { session: false });


// GET all trips
router.get('/', jwtAuth, (req, res) => {

  if(req.user) {
    console.log(req.user.id);
    User.findByUserName(req.user.username).populate({path: 'trips'}).then(function(user) {
      console.log(user.username);
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
// router.get('/:id', jwtAuth, (req, res) => {
//   //Trip.findById(req.params.id)
//   Trip.findById(req.params.id)
//   .then(trip =>res.status(200).json(trip))
//   .catch(err => {
//     console.error(err);
//     res.status(500).json({error: 'Internal Server Error'});
//   });
// })

router.get('/:id', jwtAuth, (req, res) => {
  //Trip.findById(req.params.id)
  Trip.findById(req.params.id).populate({path: 'places'})
  .then(trip =>res.status(200).json(trip))
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Internal Server Error'});
  });
})

// DELETE a trip
router.delete('/:id', jwtAuth, function(req, res)  {

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
  });

})

// POST new trip
router.post('/', jsonParser, jwtAuth, (req, res) => {
console.log("POST a trip");
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
    let aTrip;
  Trip.create({
    user: req.user.id,
    name: req.body.name,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    country: req.body.country 
  })
  .then(function(trip) {
    aTrip = trip;
    return User.findByIdAndUpdate(req.user.id, 
      { $push: {"trips": trip} },
      {  safe: true, upsert: true})         

  })
  .then(function(user) {
    res.status(201).json(aTrip.serialize());
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  })
  
})

//Update a trip
router.put('/:id', jwtAuth, jsonParser, (req, res) => {
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
    .then(trip => res.status(204).end())  //Not sending updated values. but db gets updated.
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// GET all places in a trip
router.get('/:id/places', jwtAuth, (req, res) => {
  Trip.findById(req.params.id).populate({path: 'places'})
  .then(trip => res.json(trip.places))
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Internal Server Error'});
  });
})

//GET a place by id
router.get('/:tripid/places/:placeid',jwtAuth, (req, res) => {
  Place.findById(req.params.placeid)
  .then(place => {
    console.log(place.trip.constructor.name);

    console.log(typeof(place.trip));
    console.log(req.params.tripid);
     console.log(typeof(req.params.tripid));
    if(place.trip.toString() === req.params.tripid) {
      res.json(place)
    } else{
      res.status(400).json("Trip does'nt contain the place");
    }
  })
})

//POST a new place in a trip
router.post('/:id/places', jwtAuth, jsonParser, (req, res) => {
  const requiredFields = ['name', 'description'];
  for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
          const message = `Missing \`${field}\` in request body`;
          console.error(message);
          return res.status(400).send(message);
      }
    }
    console.log(req.params.id);
    Place.create({
      trip: mongoose.Types.ObjectId(req.params.id),
      name: req.body.name,
      description: req.body.description
    })
    .then(function(place) {
      return Trip.findByIdAndUpdate(req.params.id,
        { $push: {"places": place} },
      {  safe: true, upsert: true})

    })
      .then(function(trip) {
        res.json(trip)
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      })
  })

//DELETE a place in a trip
router.delete('/:tripid/places/:placeid', jwtAuth, jsonParser, (req, res) => {
  Place.findByIdAndRemove(req.params.placeid)
  .then(function(place) {
    if(place) {
      console.log(place);
      Trip.findByIdAndUpdate({_id: req.params.tripid},
        { $pull: {places: req.params.placeid} }, function(err, data) {
          if(err) {
            console.log(err);
                return res.send(err);
          }
        return res.json(place);
      })
    } else {
       return res.send("No place found");
    }
       
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  })
})

//Update a place in a trip
router.put('/:tripid/places/:placeid', jwtAuth, jsonParser, (req, res) => {
   // ensure that the id in the request path and the one in request body match
  if (!(req.params.placeid && req.body.id && req.params.placeid === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['name', 'description'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Place
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.placeid, { $set: toUpdate })
    .then(place => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
})


router.use('*', (req, res) => {
  res.status(404).send('URL Not Found');
});

module.exports = {router};