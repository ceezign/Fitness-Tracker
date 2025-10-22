const Session = require('../models/Session');

exports.createSession = async (req, res) => {
    try {
        const session = await Session.create({
            ...req.body,
            userId: req.user._id
        });

        res.status(201).json({
            success: true,
            data: session
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user._id}).sort({ date: -1 })

        res.json({
            success: true,
            count: sessions.length,
            data: sessions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const session = await Session.findOneAndUpdate(
            {_id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.json({
            success: true,
            data: session
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.json({
            success: true,
            message: 'Session deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};