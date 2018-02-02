const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  trips: [{
  	type: mongoose.Schema.Types.ObjectId,
  	ref: "Trip"
  }]
});

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    trips: this.trips.map(trip => trip) || []
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};
UserSchema.statics.findByUserName = function(username) {
	return this.findOne({username: username});
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};

