
const mongoose = require('mongoose');

const User = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    profilePicture:{ data : Buffer, contentType : String },
    phoneNumber: { type: Number, required: true, unique: true },
    createdOn: { type: Date, required: true, default: Date.now },
    updatedOn: { type: Date, required: true, default: Date.now },
    DOB: { type: Date, required: true, default: Date.now },
    email: { type: String, required: true, unique: true, lowercase: true },
    status: { type: String, required: true, enum: ["ACTIVE", "INACTIVE", "INVITED"], default: 'INVITED' },
    gender: { type: String,  enum: ["MALE", "FEMALE"] },
    password: { type: String, required: true, trim: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role", }],
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }
});

module.exports = mongoose.model('User', User);