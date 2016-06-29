var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var User = require('./user');

var DeviceSchema = new Schema({
    owner_id: {
        type: String,
        required: true
    },
    ordering_number: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    key: {
        type: String,
        unique: true,
        trim: true
    },
    registered_on: {
        type: Number,
        required: true
    },
    data: {
        type: [{
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
        }],
        validate: [dataLimit, '{PATH} exceeds the limit of 25']
    }
});

DeviceSchema.pre('save', function (next) {
    var device = this;
    if (this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(device.key, salt, function (err, hash) {
                if (err) return next(err);
                device.key = hash;
                next();
            });
        });
    }
});

DeviceSchema.statics.compareElements = function compareElements(a, b) {
    return a.ordering_number - b.ordering_number;
};

function dataLimit(val) {
    return val.length <= 25;
}
module.exports = mongoose.model('Device', DeviceSchema);