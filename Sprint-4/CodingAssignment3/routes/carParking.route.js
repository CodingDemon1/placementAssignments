const express = require("express");
const {CarModel}=require("../models/car.model")
const {ParkingLotModel}=require("../models/parking.model")
require("dotenv").config()

const parkingRouter=express.Router();


parkingRouter.post('/park', async (req, res) => {
    const { carNumber } = req.body;

    // 1. Validate the car number.
    if (!carNumber) {
        return res.status(400).send("Car number is required.");
    }

    try {
        // 2. Find an available slot.
        const availableSlot = await ParkingLotModel.findOne({ isOccupied: false });

        if (!availableSlot) {
            return res.status(400).send("Parking lot is full.");
        }

        // 3. Park the car.
        availableSlot.isOccupied = true;
        availableSlot.carNumber = carNumber;
        await availableSlot.save();

        const car = new CarModel({ carNumber, slotNumber: availableSlot.slotNumber });
        await car.save();

        res.status(200).send({ message: "Car parked successfully", slotNumber: availableSlot.slotNumber });

    } catch (error) {
        res.status(500).send("An error occurred while trying to park the car.");
    }
});



parkingRouter.delete('/unpark/:slotNumber', async (req, res) => {
    const { slotNumber } = req.params;

    if (!slotNumber) {
        return res.status(400).send("Slot number is required.");
    }

    try {
        const slot = await ParkingLotModel.findOne({ slotNumber: Number(slotNumber) });

        if (!slot) {
            return res.status(404).send("Slot does not exist.");
        }

        if (!slot.isOccupied) {
            return res.status(400).send("The slot is already free.");
        }

        slot.isOccupied = false;
        slot.carNumber = null;
        await slot.save();

        await CarModel.findOneAndDelete({ slotNumber: Number(slotNumber) });

        res.status(200).send({ message: "Car unparked successfully." });

    } catch (error) {
        res.status(500).send("An error occurred while trying to unpark the car.");
    }
});


parkingRouter.get('/info/:input', async (req, res) => {
    const { input } = req.params;

    if (!input) {
        return res.status(400).send("Input (either car number or slot number) is required.");
    }

    try {
        // Check if the input is a number (slot number) or string (car number)
        if (!isNaN(input)) {
            const slot = await ParkingLotModel.findOne({ slotNumber: Number(input) });
            
            if (!slot) {
                return res.status(404).send("No such slot exists.");
            }
            
            return res.status(200).send({ carNumber: slot.carNumber, slotNumber: slot.slotNumber });
        } else {
            const slot = await ParkingLotModel.findOne({ carNumber: input });

            if (!slot) {
                return res.status(404).send("No car with the given number is parked.");
            }

            return res.status(200).send({ carNumber: slot.carNumber, slotNumber: slot.slotNumber });
        }

    } catch (error) {
        res.status(500).send("An error occurred while fetching the information.");
    }
});




module.exports={parkingRouter}
