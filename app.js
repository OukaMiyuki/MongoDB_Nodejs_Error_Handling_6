require('express-async-errors');
const winston = require('winston');
require('winston-mongodb'); //First you need to install winston-mongodb using npm
const error = require('./Middleware/error');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const auth = require('./Routes/auth');
const home = require('./Routes/home');
const manga = require('./Routes/manga');
const genre = require('./Routes/genre');
const userProfile = require('./Routes/userProfile');
const registerUser = require('./Routes/registerUser');
require('dotenv').config();

process.on('uncaughtException', (ex) => {
    console.log('An error occured during the startup!');
    winston.error(ex.message, ex);
});

winston.add(new winston.transports.File({ filename: 'logfile.log' }));//then add winston transport and the filename for log file
winston.add(new winston.transports.MongoDB({ //then add mongodb transport
    db: 'mongodb://localhost/mangaApp',
    level: 'error'
    //you can also store differnt kind of error or message like
    //error
    //waren
    //info
    //verbose
    //debug
    //silly
}));

throw new Error('Something error during startup!');

let key = process.env.jwtPrivateKey;
if(!key){
    console.error('Private Key is not defined!');
    process.exit(1);
}

const mongoDB = 'mongodb://localhost/mangaApp';
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex:true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Could not connect to MongoDB Server : ', err));

app.use(express.json());
app.use('/', home);
app.use('/api/manga', manga);
app.use('/api/genre', genre);
app.use('/api/user', userProfile);
app.use('/api/register', registerUser);
app.use('/api/auth', auth);

app.use(error); //the error middleware stored on the last
  
const port = 3000
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});