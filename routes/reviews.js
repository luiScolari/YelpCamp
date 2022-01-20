const express = require('express');
const router = express.Router({ mergeParams: true });

const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/asynCatch');

const Campground = require('../models/campground');
const Review = require('../models/review');

const { validateReview, isLoggedIn, isAuthor, isReviewAuthor } = require('../middleware')

router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewsId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewsId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewsId } })
    await Review.findByIdAndDelete(reviewsId)
    res.redirect(`/campgrounds/${id}`)
}));

module.exports = router;