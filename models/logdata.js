var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var Device = require('./device');

var LogData = new Schema({
    info: [{
        timestamp: {
            type: Number,
            required: true,
            trim: true
        },
        ip: {
            type: String,
            required: true,
            trim: true
        }
        // TODO add other array of machine info
    }]
});