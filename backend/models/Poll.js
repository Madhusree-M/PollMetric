const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const PollSchema = new mongoose.Schema({
    pollId: { type: String, required: true, unique: true, default: () => nanoid(10) },
    title: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    isMultiple: { type: Boolean, default: false },
    showResults: { type: Boolean, default: true },
    creator: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poll', PollSchema);
