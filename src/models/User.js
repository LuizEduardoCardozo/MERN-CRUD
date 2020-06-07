const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

schema.pre('save', async function (nxt) {
    const hash = await bcrypt.hash(this.password, 3);
    this.password = hash;
    return nxt();
});

mongoose.model('User', schema);
