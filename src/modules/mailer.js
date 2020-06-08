const path = require('path');

const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars');

const {host, post, auth} = require('../config/mail');

const transport = nodemailer.createTransport(
    {
        host: host,
        port: post,
        auth: auth
    });

transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve(__dirname, 'src', 'resources', 'mail'),
    extName: '.html',
}));

module.exports = transport;
