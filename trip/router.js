const express = require('express');
const config = require('../config');

const router = express.Router();

const {User} = require('./models');
const {Trip} = require('./models');


// Get all trips
router.get('/trips', (req, res) => {
  Trip
    .find()
    .then(trips => {
      res.json(trips.map(trip => trip.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Get a trip by id
router.get('/trips/:id', (req, res) => {
  Trip
    .findById(req.params.id)
    .then(trip => res.json(trip.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Delete a trip
router.delete('/:id', (req, res) => {
  Trip
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => res.status(204).end())
    .catch(err => {
      res.status(500).json({message: 'Internal server error'});
    })
});

module.exports = {router};