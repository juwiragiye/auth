const monk = require('monk');

const db = monk(process.env.MONGO_DB_URI);

module.exports = db;
