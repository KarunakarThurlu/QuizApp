const mongoose = require('mongoose');

const ExamDetailsModel = new mongoose.Schema({
    Name: { type: String, required: true, trim: true },
    TopicName: { type: String, required: true, trim: true },
    TestScore: { type: Number, required: true },
    Date: { type: Date, required: true, default: Date.now },
    Email: { type: String, required: true,  lowercase: true },
});

module.exports = mongoose.model('ExamDetailsModel', ExamDetailsModel);