const joi = require('joi')
module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required().min(0),
        price: joi.number().required(),
        image: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required()

    }).required()
})