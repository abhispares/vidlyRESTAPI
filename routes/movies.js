const express = require('express');
const auth = require('../middleware/auth');
const { Genre } = require('../models/genre');
const { Movie, validate } = require('../models/movie')
const route = express.Router();

route.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

route.get('/:id', async (req, res) => {
    const movies = await Movie.findById(req.params.id)
    if (!movies) return res.status(404).send('Movie Not Available');
    res.send(movies);
});

route.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid Genre');

    const movies = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movies.save();

    res.send(movies);
});

route.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const movies = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.name,
        genre: req.body.genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, {
            new: true
        });
    if (!movies) return res.status(404).send('Item Not Available');
    res.send(movies);
});

route.delete('/:id', async (req, res) => {
    const movies = await Movie.findByIdAndDelete(req.params.id)
    if (!movies) return res.status(404).send('Item Not Available');
    res.send(movies);
});

module.exports = route;
