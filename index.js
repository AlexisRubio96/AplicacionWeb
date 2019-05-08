require('dotenv').config();

//hola
//como estas
//Routes
const rootRouter = require('./routes/root');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const eventRouter = require('./routes/event');
const userRouter = require('./routes/user');


//______Loaded modules_______
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

//For Login
const passport = require('passport')
const flash    = require('connect-flash');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');

//Session
app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false
}));

//Passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 
require('./config/passport')(passport);

//Express
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded( {extended: false }));
app.set('view engine', 'ejs');
//Express Login
app.use(morgan('dev')); 
app.use(cookieParser());
app.use(bodyParser.json());

//Routes usages
app.use(express.json());
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/event', eventRouter);
app.use('/', rootRouter);

//DB connection with .env
mongoose.connect(process.env.DB_CON, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.log('Error...', err.message));

//Server connection with .env
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando en el puerto ${ port }`));