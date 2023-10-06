const express = require("express");
const { Connection } = require("./Config/db");
const { GitDetailsRouter } = require("./Routes/GitDetails.Routes");
require("dotenv").config();
const port = process.env.PORT || 8000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ msg: "Welcome to GitDetails, This is the basic EndPoint!!!!" });
});

app.use("/github", GitDetailsRouter);

app.listen(port, async () => {
	try {
		await Connection();
		console.log("Connected to DB");
	} catch (error) {
		console.log(error.message);
	}
	console.log(`Listening @ ${port}!!!`);
});
