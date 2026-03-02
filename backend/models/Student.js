const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    regNo: { type: String, required: true, unique: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('Student', StudentSchema);
