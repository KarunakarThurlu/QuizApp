const mongoose = require("mongoose");

const TopicsModel = new mongoose.Schema({
    topicName: { type: String, required: true, trim: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String, required: true, trim: true },
    createdOn: { type: Date, required: true, default: Date.now },
    updatedOn: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Topic", TopicsModel);