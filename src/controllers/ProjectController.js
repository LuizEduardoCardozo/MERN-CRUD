const express = require('express')
const router = express.Router()

const AuthMiddleWare = require('../middlewares/auth');

router.use(AuthMiddleWare);

router.get('/', (req, res) => {

    const { userId } = req;
    
    res.send({ok:"True", userId})

})

module.exports = app => app.use("/projects",router);
