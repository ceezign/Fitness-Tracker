const express = require('express');
const router = express.Router();
const {
    createSession,
    getSessions,
    updateSession,
    deleteSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .post(createSession)
    .get(getSessions);

router.route('/:id')
    .put(updateSession)
    .delete(deleteSession);

module.exports = router;