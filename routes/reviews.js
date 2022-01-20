const express = require('express');
const router = express.Router({ mergeParams: true });

const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/asynCatch');

const Campground = require('../models/campground');
const Review = require('../models/review');

const { validateReview, isLoggedIn, isAuthor, isReviewAuthor } = require('../middleware')

const reviews = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.delete('/:reviewsId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;