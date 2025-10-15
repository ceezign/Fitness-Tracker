const mongoose = require("mongoose")


const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    activity: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1 // duration in minutes
    },
    intensity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    burned: {
        type: Number,
        required: true,
        min: 0 // calories burned
    },
    sets: Number,
    reps: Number,
    weight: Number,
    distance: Number,
    notes: String
}, { timestamps: true});

module.exports = mongoose.model('Session', sessionSchema);