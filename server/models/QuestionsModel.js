const mongoose = require('mongoose');

const QuestionsSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    optionA: { type: String, required: true, trim: true },
    optionB: { type: String, required: true, trim: true },
    optionC: { type: String, trim: true },
    optionD: { type: String, trim: true },
    createdOn: { type: Date, required: true, default: Date.now },
    updatedOn: { type: Date, required: true, default: Date.now },
    answer: { type: String, required: true, trim: true, uppercase: true, enum: ["A", "B", "C", "D", "E"] },
    status: { type: String, required: true, enum: ["PENDING", "APPROVED", "REJECTED"], default: 'PENDING' },
    rejectedReason: { type: String, trim: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" }
});

module.exports = mongoose.model("Questions", QuestionsSchema);