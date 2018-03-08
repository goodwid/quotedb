const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Quote', new Schema({
  data: {
    type: String,
    required: true
  },
  movie: {
    type: String,
    required: true
  },
  series: {
    type: String,
  }
},{
  timestamps: true
}));
