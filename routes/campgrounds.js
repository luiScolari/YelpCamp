const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/asynCatch');

const Campground = require('../models/campground');

const { campgroundSchema, reviewSchema } = require('../schemas');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')

const campgrounds = require('../controllers/campgrounds')


const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });


router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, (campgrounds.renderNewForm));

router.route('/:id')
    .get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, wrapAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));



module.exports = router;