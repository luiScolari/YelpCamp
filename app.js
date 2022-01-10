const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const { application } = require('express');
const { findByIdAndUpdate, findById } = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const wrapAsync = require('./utils/asynCatch');
const { campgroundSchema, reviewSchema } = require('./schemas');
const session = require('express-session')
const flash = require('connect-flash')

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const { date } = require('joi');

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'Not a good secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect('mongodb://localhost:27017/yelp-camp', {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    next();
})


app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
});





app.all('*', (req, res, next) => {
    next(new ExpressError('Not found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something went wrong'
    res.status(status).render('error', { err })
})

app.listen(3000, () => {
    console.log('Listening to port 3000');
});