const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const modelSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Model', modelSchema)
