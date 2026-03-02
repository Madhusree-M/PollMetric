const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    pollId: { type: String, required: true, ref: 'Poll' },
    regNo: { type: String, required: true, ref: 'Student' },
    selectedOption: { type: [String], required: true }
});

// Prevent duplicate voting: A student can vote only once per poll
ResponseSchema.index({ pollId: 1, regNo: 1 }, { unique: true });

module.exports = mongoose.model('Response', ResponseSchema);
