const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/asynCatch');

const Campground = require('../models/campground');

const { campgroundSchema, reviewSchema } = require('../schemas');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')


router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'You successfully made a new campground!')
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find this campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find this campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'You successfully updated a campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You successfully deleted a campground')
    res.redirect('/campgrounds');
}));

module.exports = router;