const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const Campground = require('./models/campground');
const methodOverride = require('method-override')
const { application } = require('express');
const { findByIdAndUpdate, findById } = require('./models/campground');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost:27017/yelp-camp', {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', (req, res) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
});


app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render(`campgrounds/edit`, { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params.id
    const { title, location} = req.body.campground
    const editedCamp = await Campground.findByIdAndUpdate(id, {title: title, location: location}, {new: true})
    res.redirect('/campgrounds')
})


app.listen(3000, () => {
    console.log('Listening to port 3000')
});