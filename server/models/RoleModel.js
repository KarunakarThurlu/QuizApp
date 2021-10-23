const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    role_name: { type: String, required: true, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' }
});

module.exports = mongoose.model('Role', RoleSchema);