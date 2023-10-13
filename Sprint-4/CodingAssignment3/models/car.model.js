const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    carNumber: {
        type: String,
        required: true,
        unique: true
    },
    slotNumber: {
        type: Number,
        required: true,
        unique: true
    }
});

const CarModel = mongoose.model('Car', carSchema);

module.exports = {CarModel};
