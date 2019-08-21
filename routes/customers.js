const { Customer, validate } = require('../models/customer');
const express = require('express');
const route = express.Router();
const auth = require('../middleware/auth');


route.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

route.get('/:id', async (req, res) => {
    const customers = await Customer.findById(req.params.id)
    if (!customers) return res.status(404).send('Item Not Available');
    res.send(customers);
});

route.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customers = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    customers = await customers.save();

    res.send(customers);
});

route.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customers = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {
            new: true
        });
    if (!customers) return res.status(404).send('Item Not Available');
    res.send(customers);
});

route.delete('/:id', async (req, res) => {
    const customers = await Customer.findByIdAndDelete(req.params.id)
    if (!customers) return res.status(404).send('Item Not Available');
    res.send(customers);
});
module.exports = route;