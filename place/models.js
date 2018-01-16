const mongoose = require('mongoose');

cont PlaceSchema = mongoose.Schema({
	name: String,
	description: String

});

PlaceSchema.methods.serialize = function() {
	console.log("Place schema");
	return {
		name: this.name || '',
		description: this.description || ''
	}
}
const Place = mongoose.model('Place', PlaceSchema);
module.exports = {Place};