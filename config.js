exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/trip-journal-app';
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || 'testing';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';