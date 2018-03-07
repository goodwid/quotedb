const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Quote', new Schema({
  data: {
    type: String,
    required: true
  },
},{
  timestamps: true
}));
