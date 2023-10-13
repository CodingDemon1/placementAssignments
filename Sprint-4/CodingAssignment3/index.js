const express=require('express');
const {ParkingLotModel} = require('./models/parking.model');
const rateLimit = require('express-rate-limit');
const {Connection}=require("./config/db")
const {parkingRouter}=require("./routes/carParking.route")
require("dotenv").config()

const app=express()

const PORT = process.env.PORT || 8000;

app.use(express.json())

app.use(rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5
 }));




async function initializeParkingSlots() {
    const count = await ParkingLotModel.find().count();

    // Check if there are any slots in the database
    if (count === 0) {
        let parkingSlots = [];

        // Create parking slots based on PARKING_LOT_SIZE
        for (let i = 1; i <= process.env.PARKING_LOT_SIZE; i++) {
            parkingSlots.push({ slotNumber: i });
        }

        // Insert all the parking slots into the database
        await ParkingLotModel.insertMany(parkingSlots);
        console.log("Parking slots initialized");
    }
}


app.get("/",(req,res)=>{
    res.send("This is car parking site")
})

app.use("/car",parkingRouter)

app.listen(PORT,async()=>{
    try {
        await Connection
        console.log("Connected to DB")
        initializeParkingSlots();
    } catch (error) {
        console.log("Error in connecting to DB")
    }
    console.log("server running @ 8000")
})