const express = require('express')
const router = express.Router()

const AuthMiddleWare = require('../middlewares/auth');

router.use(AuthMiddleWare);

router.get('/', (req, res) => {
    res.send({ok:"True"})
})

module.exports = app => app.use("/projects",router);
