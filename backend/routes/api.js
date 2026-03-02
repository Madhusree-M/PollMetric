const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Poll = require('../models/Poll');
const Response = require('../models/Response');
const Group = require('../models/Group');
const xlsx = require('xlsx');

// 1. Student Registration
router.post('/register', async (req, res) => {
    try {
        const { regNo, name } = req.body;
        if (!regNo || !name) return res.status(400).json({ error: 'All fields are required' });

        let student = await Student.findOne({ regNo });
        if (!student) {
            student = new Student({ regNo, name });
            await student.save();
        }
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Create Poll
router.post('/polls', async (req, res) => {
    try {
        const { title, question, options, isMultiple, showResults, creator, groupId } = req.body;
        if (!title || !question || !options || !creator) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        const newPoll = new Poll({ title, question, options, isMultiple, showResults, creator, groupId });
        await newPoll.save();
        res.status(201).json(newPoll);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2b. Get Polls (with optional creator filtering)
router.get('/polls', async (req, res) => {
    try {
        const { creator } = req.query;
        const filter = creator ? { creator } : {};
        const polls = await Poll.find(filter).sort({ createdAt: -1 });
        res.status(200).json(polls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get Poll Details
router.get('/polls/:id', async (req, res) => {
    try {
        const poll = await Poll.findOne({ pollId: req.params.id });
        if (!poll) return res.status(404).json({ error: 'Poll not found' });
        res.status(200).json(poll);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3b. Get Pending Polls for a user
router.get('/polls/pending/:regNo', async (req, res) => {
    try {
        const { regNo } = req.params;

        // 1. Get student to see what groups they are in
        const student = await Student.findOne({ regNo });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        // 2. Find groups that contain this student's regNo
        const groups = await Group.find({ 'students.regNo': regNo });
        const groupIds = groups.map(g => g._id);

        // 3. Find all polls targeting these groups OR targeting 'All Students' (groupId: null)
        const polls = await Poll.find({
            $or: [
                { groupId: { $in: groupIds } },
                { groupId: null }
            ]
        }).sort({ createdAt: -1 });

        // 4. Filter out polls the student has already responded to
        const responses = await Response.find({ regNo });
        const votedPollIds = responses.map(r => r.pollId);

        const pendingPolls = polls.filter(p => !votedPollIds.includes(p.pollId));

        res.status(200).json(pendingPolls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3c. Get Responded Polls for a user
router.get('/polls/responded/:regNo', async (req, res) => {
    try {
        const { regNo } = req.params;

        const student = await Student.findOne({ regNo });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        // Find all responses by this student
        const responses = await Response.find({ regNo });
        const votedPollIds = responses.map(r => r.pollId);

        // Get the poll details for voted polls
        const polls = await Poll.find({ pollId: { $in: votedPollIds } }).sort({ createdAt: -1 });

        // Attach selected options to each poll
        const respondedPolls = polls.map(p => {
            const resp = responses.find(r => r.pollId === p.pollId);
            return {
                ...p.toObject(),
                selectedOptions: resp ? resp.selectedOption : []
            };
        });

        res.status(200).json(respondedPolls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Vote
router.post('/vote', async (req, res) => {
    try {
        const { pollId, regNo, selectedOptions } = req.body; // Expecting array for multi-select

        if (!selectedOptions || !Array.isArray(selectedOptions) || selectedOptions.length === 0) {
            return res.status(400).json({ error: 'Please select at least one option' });
        }

        // Check availability
        const poll = await Poll.findOne({ pollId });
        if (!poll) return res.status(404).json({ error: 'Poll not found' });

        // Check if student exists
        const student = await Student.findOne({ regNo });
        if (!student) return res.status(404).json({ error: 'Student not found. Please register.' });

        // Prevent duplicate vote
        const existingVote = await Response.findOne({ pollId, regNo });
        if (existingVote) return res.status(400).json({ error: 'You have already voted' });

        const response = new Response({ pollId, regNo, selectedOption: selectedOptions });
        await response.save();
        res.status(201).json({ message: 'Vote submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4b. Modify Vote
router.put('/vote', async (req, res) => {
    try {
        const { pollId, regNo, selectedOptions } = req.body;

        if (!selectedOptions || !Array.isArray(selectedOptions) || selectedOptions.length === 0) {
            return res.status(400).json({ error: 'Please select at least one option' });
        }

        const poll = await Poll.findOne({ pollId });
        if (!poll) return res.status(404).json({ error: 'Poll not found' });

        const existingVote = await Response.findOne({ pollId, regNo });
        if (!existingVote) return res.status(404).json({ error: 'No existing response found' });

        existingVote.selectedOption = selectedOptions;
        await existingVote.save();
        res.status(200).json({ message: 'Response updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4c. Check existing vote
router.get('/vote/:pollId/:regNo', async (req, res) => {
    try {
        const { pollId, regNo } = req.params;
        const existingVote = await Response.findOne({ pollId, regNo });
        if (existingVote) {
            res.status(200).json({ voted: true, selectedOptions: existingVote.selectedOption });
        } else {
            res.status(200).json({ voted: false });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Generate Report
router.get('/reports/:id', async (req, res) => {
    try {
        const pollId = req.params.id;
        const poll = await Poll.findOne({ pollId });
        if (!poll) return res.status(404).json({ error: 'Poll not found' });

        let expectedStudents = [];
        let groupName = null;
        if (poll.groupId) {
            const group = await Group.findById(poll.groupId);
            if (group) {
                expectedStudents = group.students;
                groupName = group.name;
            }
        }

        // If no group, default to all registered students
        if (expectedStudents.length === 0) {
            expectedStudents = await Student.find({}, 'regNo name');
        }

        const allResponses = await Response.find({ pollId });
        const votedRegNos = allResponses.map(r => r.regNo);

        const reportData = {
            pollTitle: poll.title,
            question: poll.question,
            groupName: groupName,
            options: poll.options,
            showResults: poll.showResults,
            isMultiple: poll.isMultiple,
            totalStudents: expectedStudents.length,
            votedCount: allResponses.length,
            responses: allResponses.map(r => {
                const s = expectedStudents.find(stu => stu.regNo === r.regNo);
                return {
                    regNo: r.regNo,
                    name: s ? s.name : 'Unknown',
                    selectedOption: r.selectedOption
                };
            }),
            notVoted: expectedStudents.filter(s => !votedRegNos.includes(s.regNo)),
            participationPercentage: expectedStudents.length ? ((allResponses.length / expectedStudents.length) * 100).toFixed(2) : 0
        };

        res.status(200).json(reportData);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Export to Excel
router.get('/export/:id', async (req, res) => {
    try {
        const pollId = req.params.id;
        const poll = await Poll.findOne({ pollId });
        if (!poll) return res.status(404).json({ error: 'Poll not found' });

        let expectedStudents = [];
        if (poll.groupId) {
            const group = await Group.findById(poll.groupId);
            if (group) expectedStudents = group.students;
        }

        if (expectedStudents.length === 0) {
            expectedStudents = await Student.find({});
        }

        const allResponses = await Response.find({ pollId });

        const data = expectedStudents.map(s => {
            const vote = allResponses.find(r => r.regNo === s.regNo);
            return {
                'Register Number': s.regNo,
                'Name': s.name,
                'Status': vote ? 'Voted' : 'Not Voted',
                'Selected Option': vote ? (Array.isArray(vote.selectedOption) ? vote.selectedOption.join(', ') : vote.selectedOption) : '-'
            };
        });

        const ws = xlsx.utils.json_to_sheet(data);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "Report");

        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', `attachment; filename="report-${pollId}.xlsx"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buf);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Groups API
router.post('/groups', async (req, res) => {
    try {
        const { name, students, creatorId } = req.body;
        if (!name || !students || !creatorId) return res.status(400).json({ error: 'Missing fields' });

        const group = new Group({ name, students, creatorId });
        await group.save();
        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/groups', async (req, res) => {
    try {
        const { creatorId } = req.query;
        const groups = await Group.find({ creatorId }).sort({ name: 1 });
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
