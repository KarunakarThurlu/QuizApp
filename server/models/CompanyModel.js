const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    creationDate: { type: Date, required: true },
    companySize: { type: String, required: true }
});

module.exports = mongoose.model('Company', CompanySchema);