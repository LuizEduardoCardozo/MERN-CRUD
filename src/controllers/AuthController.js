const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

require('../models/User');

const User = mongoose.model('User');

router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.json(user);

    } catch (err) {
        return res.json({error: err});
    }
    
});

module.exports = app => app.use('/auth', router);

