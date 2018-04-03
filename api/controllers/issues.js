'use strict';

require('mongoose')

const Issue = require('../models/issue');

function create(req, res) {
    const body = req.swagger.params.body.value;
    Issue.create(body, (err, issue) => {
        if (err) return void res.status(500).send(err);
        res.status(201).json(issue);
    });
}

function getByID(req, res) {
    const criteria = { _id: req.swagger.params._id.value };
    Issue.findOne(criteria).lean().exec((err, issue) => {
        if (err) return void res.status(500).send(err);
        if (!issue) return void res.sendStatus(404);
        res.json(issue);
    });
}

function index(req, res) {
    // TODO paginate
    Issue.find({}).lean().exec((err, issues) => {
        if (err) return void res.status(500).send(err);
        res.json(issues);
    });
}

module.exports = {
    create,
    getByID,
    index
};
