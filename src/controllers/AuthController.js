const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');

const mailer = require('../modules/mailer');

const authConfig = require('../config/auth');

const router = express.Router();

require('../models/User');

const User = mongoose.model('User');

async function generateToken(params = {}) { 
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {

    try {

        const { email } = req.body;

        if(await User.findOne( { email } )) {
            return res.status(400).json({'error':'the email was already registred'});
        }

        const user = await User.create(req.body);

        user.password = undefined;

        return res.json( { user, token: await generateToken({ id: user.id }) } );

    } catch (err) {
        return res.json({error: err});
        
    }

});

router.post('/authenticate', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user)
        return res.status( 400 ).json({error: "User not found!"});

    if(!await bcrypt.compare(password, user.password))
        return res.json({ stauts: "Password not match!" });

    user.password = undefined;

    return res.json( { user, token: await generateToken({ id: user.id }) } );

});

router.post('/forgot', async (req, res) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({ email });

        
        if(!user) return res.status(400).json({err: "User not found!"});
        
        const forgottenToken = crypto.randomBytes(20).toString('hex');
        
        const now = new Date;
        now.setHours(now.getHours() + 1);
        
        await User.findByIdAndUpdate(user.id, 
            {
                passwordResetToken: forgottenToken,
                passwordResetExpires: now,
            },
            {new: true}
        );

        await mailer.sendMail({
            to: email,
            from:'admin@dosistema.com',
            template: './auth/forgot_email',
            context: { token: forgottenToken },
        }, (err) => {
            if(err) console.log(err);
            return res.status(300);
        });

        // For debugging purposes  
        // return res.json({forgottenToken, now});


    }catch (err) {
        return res.status(400).json({err: "An error has found! try again later, please"});
    }

});

router.post('/reset', async (req,res) => {

    const {email, token, npassword} = req.body

    const user = await User.findOne({email}).select(['+passwordResetToken','+passwordResetExpires']);

    if(!user) res.status(400).json({err: "User not found!"});
    if(user.passwordResetExpires > Date.now) return res.status(401).json({err: "Token expired!"});
    if(!bcrypt.compare(token,user.passwordResetToken)) res.status(400).json({err: "The token is wrong"});

    user.password = npassword;

    await user.save();

    return res.status(300).json({msg: "Sucesses"});


});

module.exports = app => app.use('/auth', router);
