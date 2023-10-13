const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
    slotNumber: {
        type: Number,
        required: true,
        unique: true
    },
    isOccupied: {
        type: Boolean,
        default: false
    },
    carNumber: {
        type: String,
        default: null
    }
});

const ParkingLotModel = mongoose.model('ParkingLot', parkingLotSchema);

module.exports = {ParkingLotModel};
