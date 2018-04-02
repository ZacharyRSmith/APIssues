'use strict';

const fs = require('fs');

const Issue = require('../models/issue');

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
    create: (req, res) => {
        fs.writeFile(__dirname + '/' + 'originalname.png', req.swagger.params.upfile.value.buffer, (writeFileErr) => {
            if (writeFileErr) return void res.status(500).send(writeFileErr);
            res.sendStatus(201);
            // res.status(201).send({ created: true });
        });
    },
    getByID,
    index
};
