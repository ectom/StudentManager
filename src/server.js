const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./server/config/routes')(app);

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
