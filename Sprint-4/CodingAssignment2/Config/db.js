const mongoose = require("mongoose");

const Connection = () => {
	mongoose.connect(process.env.MONGO_URI);
};

module.exports = { Connection };
