const mongoose = require("mongoose");

const GitDetailsSchema = new mongoose.Schema({
	id: Number,
	name: String,
	html_url: String,
	description: String,
	created_at: Date,
	open_issues: Number,
	watchers: Number,
	owner: Object,
});

const GitDetailsModel = mongoose.model("GitDetail", GitDetailsSchema);

module.exports = { GitDetailsModel };
