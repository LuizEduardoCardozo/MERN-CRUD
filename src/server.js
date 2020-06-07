const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./controllers/AuthController')(app);
require('./controllers/ProjectController')(app);

app.listen(3000)
