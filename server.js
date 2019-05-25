const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const cocktails = require('./app/cocktails');
const users = require('./app/users');

const port = 8000;

mongoose.connect(config.dbUrl, config.mongoOptions).then(() => {
    app.use('/cocktails', cocktails);
    app.use('/users', users);
    app.listen(port, () => {
        console.log(`Server started on ${port} port`)
    })
})