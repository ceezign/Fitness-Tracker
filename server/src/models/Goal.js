const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    goal: {
        type: Number,
        required: true
    },
    current: {
        type: Number,
        default: 0
    },
    metric: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);