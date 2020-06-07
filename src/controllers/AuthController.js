const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const router = express.Router();

require('../models/User');

const User = mongoose.model('User');

router.post('/register', async (req, res) => {

    const { email } = req.body;

    try {

        if(await User.findOne( { email } )) {
            return res.status(400).json({'error':'the email was already registred'});
        }
        const user = await User.create(req.body);
        user.password = undefined;

        return res.json(user);

    } catch (err) {
        return res.json({error: err});
    }

});

router.post('/authenticate', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user)
        return res.status( 400 ).json({error: "User not found!"});

    console.log(!await bcrypt.compare(password, user.password));

    if(!await bcrypt.compare(password, user.password))
        return res.json({ stauts: "Password not match!" });

        user.password = undefined;
    return res.json({user});

});

module.exports = app => app.use('/auth', router);

