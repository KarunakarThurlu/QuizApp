const { json } = require('express');
const mongoose = require('mongoose');

const ExamModel = new mongoose.Schema({
    TestAnswers: [{  }],
    TestQuestions : [{ type: mongoose.Schema.Types.ObjectId, ref: "Questions", }],
    Name: { type: String, required: true, trim: true },
    profilePicture:{ type: String,trim: true },
    TopicName: { type: String, required: true, trim: true },
    TestScore: { type: Number, required: true },
    Date: { type: Date, required: true, default: Date.now },
    Email: { type: String, required: true,  lowercase: true },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model('Exam', ExamModel);