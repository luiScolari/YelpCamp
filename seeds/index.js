const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const axios = require('axios');
const { descriptors, places } = require('./seedHelpers');
const params = require('./params')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const getImg = async () => {
    try {
        const config = { headers: { Accept: 'application/json' } };

        const res = await axios.get('https://api.unsplash.com/search/photos', params, config);

        return res.data.results;

    } catch (e) {
        console.log(e);
    }

};


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async (req, res) => {
    const imgUrl = await getImg();
    await Campground.deleteMany({});
    for (let i = 0; i < imgUrl.length; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: imgUrl[i].urls.raw
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
