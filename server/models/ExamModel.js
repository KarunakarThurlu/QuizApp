const { json } = require('express');
const mongoose = require('mongoose');

const ExamModel = new mongoose.Schema({
    TestAnswers: [{  }],
    TestQuestions : [{ type: mongoose.Schema.Types.ObjectId, ref: "Questions", }],
    TopicName: { type: String, required: true, trim: true },
    TestScore: { type: Number, required: true },
    Date: { type: Date, required: true, default: Date.now },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model('Exam', ExamModel);