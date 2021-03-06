const mongoose = require('mongoose');

const TripSchema = mongoose.Schema({
	
	user: {type: mongoose.Schema.Types.ObjectId , ref: "User"},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	startDate: {
		type: Date,
		required: true
	},
	endDate: {
		type: Date,
		required: true
	},
	country: {
		type: String,
		required: true
	},
	places: [{
  		type: mongoose.Schema.Types.ObjectId,
  		ref: "Place"
  	}]
})
TripSchema.methods.serialize = function() {
	return {
		//userId: this.user.id || '', 
		id: this._id,
		name: this.name || '',
		description: this.description || '',
		startDate: this.startDate || '',
		endDate: this.endDate || '',
		country: this.country || '',
		places: this.places.map(place => place) || []
	}
}

const Trip = mongoose.model('Trip', TripSchema);
module.exports = {Trip};