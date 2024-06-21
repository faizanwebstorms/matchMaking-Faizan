const mongoose = require('mongoose');

/**
 * Location point Data schema
 * @type {*}
 */
const pointSchema = mongoose.Schema({
    name: {
      type: String,
    },
    coordinates: {
      type: [Number],
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    region: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    _id: false,
  });

  module.exports = {
    pointSchema
  };