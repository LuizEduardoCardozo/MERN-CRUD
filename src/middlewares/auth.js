const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) 
        return res.status(401).json({err:"No token provided"});

    // Token jwt => Barrer ${Hash}

    const parts = authHeader.split(" ");
    
    if(parts.length != 2)
        return res.status(401).json({err: "Token format error"});

    const [ schema, token ] = parts

    if (!/^Bearer$/i.test(schema))
        return res.status(401).json({err: "Token malfformated"});

    jwt.verify(token, authConfig.secret, (err, decoded) => {

        if(err) return res.status(401).json({err: 'Token invalid'});

        req.userId = decoded.id;

    })

    return next();

}