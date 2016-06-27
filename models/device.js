var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var User = require('./user');

var DeviceSchema = new Schema({
    owner: {
        type: User,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
    if (this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(this.name + this.owner.name, salt, function (err, hash) {
                if (err) return next(err);
                this.key = hash;
                next();
            });
        });
    }
});

function dataLimit(val) {
    return val.length <= 25;
}
module.exports = mongoose.model('Device', DeviceSchema);