const mongoose = require('mongoose');

const PlaceSchema = mongoose.Schema({
	name: String,
	description: String,
	date: {
		type: Date,
		default: Date.now()
	},
	trip: {type: mongoose.Schema.Types.ObjectId , ref: "Trip"}

});

PlaceSchema.methods.serialize = function() {
	console.log("Place schema");
	return {
		id: this._id,
		name: this.name || '',
		description: this.description || ''
	}
}
const Place = mongoose.model('Place', PlaceSchema);
module.exports = {Place};