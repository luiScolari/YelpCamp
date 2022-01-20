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
        const price = Math.floor(Math.random() * 500)
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '61e6524b335a0dfd05b1ba09',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: imgUrl[i].urls.raw,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus eum, cumque exercitationem sint, in vero repellat aliquam hic porro ut, quia optio expedita molestias beatae repudiandae maxime fugit sapiente sequi?',
            price,
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
