const { Schema, model } = require('mongoose');

const partySchema = new Schema({
  partyname: String,
  location: String,
  startsat: String,
  endsat: String,
  description: String,
});

module.exports = model('party', partySchema);
